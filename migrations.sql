




CREATE TYPE request_status AS ENUM ('waiting', 'in_progress', 'completed');


CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    position INT NOT NULL,
    alias TEXT NOT NULL,
    description TEXT NOT NULL,
    status request_status DEFAULT 'waiting',
    estimated_days INT DEFAULT 7,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE INDEX idx_requests_position ON requests(position);
CREATE INDEX idx_requests_status ON requests(status);


ALTER TABLE requests ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Enable read access for all users" ON requests
    FOR SELECT USING (true);



CREATE POLICY "Enable all access for authenticated users" ON requests
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');



