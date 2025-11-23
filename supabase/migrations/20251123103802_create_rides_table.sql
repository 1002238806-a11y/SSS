/*
  # Create rides table

  1. New Tables
    - `rides`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `type` (text: 'offer' or 'request')
      - `origin` (text)
      - `destination` (text)
      - `date` (date)
      - `time` (time)
      - `seats` (integer)
      - `phone` (text)
      - `driver_name` (text)
      - `is_recurring` (boolean)
      - `recurring_days` (integer array)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `rides` table
    - Add policy for users to read all rides
    - Add policy for users to create their own rides
    - Add policy for users to delete their own rides
*/

CREATE TABLE IF NOT EXISTS rides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('offer', 'request')),
  origin text NOT NULL,
  destination text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  seats integer,
  phone text,
  driver_name text,
  is_recurring boolean DEFAULT false,
  recurring_days integer[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read rides"
  ON rides FOR SELECT
  USING (true);

CREATE POLICY "Users can create own rides"
  ON rides FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own rides"
  ON rides FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX rides_date_time_idx ON rides(date, time);
CREATE INDEX rides_user_id_idx ON rides(user_id);