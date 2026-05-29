-- Migration for Notifications System

-- 1. Create Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL, -- Recipient
    actor_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL, -- Person who triggered it
    type TEXT CHECK (type IN ('like', 'follow', 'message', 'achievement', 'system')) NOT NULL,
    content TEXT,
    target_id UUID, -- Optional: post_id, message_id, etc.
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Enable Realtime
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;
END $$;

-- 2. Triggers for automatic notifications

-- Follow Notification
CREATE OR REPLACE FUNCTION public.handle_new_follow_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, actor_id, type, content)
    VALUES (NEW.following_id, NEW.follower_id, 'follow', 'started following you');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_new_follow_notification ON public.follows;
CREATE TRIGGER on_new_follow_notification
AFTER INSERT ON public.follows
FOR EACH ROW EXECUTE FUNCTION public.handle_new_follow_notification();

-- Like Notification
CREATE OR REPLACE FUNCTION public.handle_new_like_notification()
RETURNS TRIGGER AS $$
DECLARE
    post_owner_id UUID;
BEGIN
    SELECT user_id INTO post_owner_id FROM public.posts WHERE id = NEW.post_id;
    
    -- Don't notify if liking own post
    IF post_owner_id != NEW.user_id THEN
        INSERT INTO public.notifications (user_id, actor_id, type, content, target_id)
        VALUES (post_owner_id, NEW.user_id, 'like', 'liked your post', NEW.post_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_new_like_notification ON public.post_likes;
CREATE TRIGGER on_new_like_notification
AFTER INSERT ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_new_like_notification();

-- Message Notification
CREATE OR REPLACE FUNCTION public.handle_new_message_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, actor_id, type, content, target_id)
    VALUES (NEW.receiver_id, NEW.sender_id, 'message', 'sent you a message', NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_new_message_notification ON public.messages;
CREATE TRIGGER on_new_message_notification
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.handle_new_message_notification();
