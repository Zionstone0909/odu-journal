-- Notifications table for storing all user notifications
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  is_read boolean NOT NULL DEFAULT false,
  link text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications"
  ON public.notifications
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

CREATE OR REPLACE FUNCTION public.notify_on_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.is_approved = true AND (OLD.is_approved = false OR OLD.is_approved IS NULL) THEN
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (NEW.id, 'Account Approved', 'Your account has been approved. You can now submit manuscripts.', 'success', '/submission/dashboard');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_approved
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_approval();

CREATE OR REPLACE FUNCTION public.notify_on_role_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.role = 'editor' THEN
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (NEW.user_id, 'Editor Role Assigned', 'You have been assigned the Editor role on the editorial board.', 'info', '/manuscript-center');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_role_assigned
  AFTER INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_role_assignment();