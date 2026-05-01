-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    content TEXT NOT NULL,
    user_name TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read chat messages" ON chat_messages
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert chat messages" ON chat_messages
    FOR INSERT WITH CHECK (true);
