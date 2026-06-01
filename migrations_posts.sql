



CREATE TYPE post_type AS ENUM ('image', 'text');

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_type post_type NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    description TEXT,
    order_index INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_posts_published ON posts(is_published);
CREATE INDEX idx_posts_order ON posts(order_index);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Enable read access for published posts" ON posts
    FOR SELECT USING (is_published = true);
