--
-- PostgreSQL database dump
--

\restrict W5KUQJiJBAindlMCM0u3jUuKwbhmchcvfvqI1JSwOegC8ijqiv0LbY61ZDersDc

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    idea_id uuid NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: idea_interests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.idea_interests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    idea_id uuid,
    company_id uuid,
    created_at timestamp without time zone DEFAULT now(),
    message text,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    status_updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT check_valid_status CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'contacted'::character varying, 'in_discussion'::character varying, 'declined'::character varying, 'closed'::character varying])::text[])))
);


--
-- Name: idea_tabs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.idea_tabs (
    id integer NOT NULL,
    idea_id uuid,
    title character varying(100) NOT NULL,
    content text,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: idea_tabs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.idea_tabs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: idea_tabs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.idea_tabs_id_seq OWNED BY public.idea_tabs.id;


--
-- Name: ideas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ideas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    startup_name character varying(255) CONSTRAINT ideas_company_name_not_null NOT NULL,
    category character varying(100) NOT NULL,
    logo_url text,
    cover_image_url text,
    phone_number character varying(50),
    upvote_count integer DEFAULT 0,
    downvote_count integer DEFAULT 0,
    comment_count integer DEFAULT 0,
    interest_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    has_pitch_deck boolean DEFAULT false NOT NULL,
    short_description text DEFAULT ''::text NOT NULL,
    status character varying(20) DEFAULT 'draft'::character varying,
    youtube_url character varying(255),
    slides_url character varying(255)
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    recipient_id uuid NOT NULL,
    actor_id uuid,
    type character varying(30) NOT NULL,
    idea_id uuid,
    message text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT notifications_type_check CHECK (((type)::text = ANY ((ARRAY['upvote'::character varying, 'downvote'::character varying, 'comment'::character varying, 'interest'::character varying])::text[])))
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    user_type character varying(20) NOT NULL,
    full_name character varying(255),
    community_role character varying(20),
    faculty character varying(255),
    matric_number character varying(50),
    year_of_study integer,
    company_name character varying(255),
    industry character varying(255),
    contact_person character varying(255),
    phone character varying(50),
    is_verified boolean DEFAULT false,
    is_approved boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    profile_pictures_url text,
    location character varying(255),
    email_verified boolean DEFAULT false NOT NULL,
    verification_token character varying(255),
    verification_token_expires timestamp without time zone,
    reset_token character varying(255),
    reset_token_expires timestamp without time zone,
    CONSTRAINT users_community_role_check CHECK (((community_role)::text = ANY (ARRAY['student'::text, 'lecturer'::text, 'staff'::text, 'admin'::text]))),
    CONSTRAINT users_user_type_check CHECK (((user_type)::text = ANY ((ARRAY['community'::character varying, 'company'::character varying])::text[]))),
    CONSTRAINT users_year_of_study_check CHECK (((year_of_study >= 1) AND (year_of_study <= 6)))
);


--
-- Name: votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    idea_id uuid,
    user_id uuid,
    vote_type character varying(4),
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT votes_vote_type_check CHECK (((vote_type)::text = ANY ((ARRAY['up'::character varying, 'down'::character varying])::text[])))
);


--
-- Name: idea_tabs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.idea_tabs ALTER COLUMN id SET DEFAULT nextval('public.idea_tabs_id_seq'::regclass);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: idea_interests idea_interests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.idea_interests
    ADD CONSTRAINT idea_interests_pkey PRIMARY KEY (id);


--
-- Name: idea_tabs idea_tabs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.idea_tabs
    ADD CONSTRAINT idea_tabs_pkey PRIMARY KEY (id);


--
-- Name: ideas ideas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ideas
    ADD CONSTRAINT ideas_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: idea_interests unique_idea_company; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.idea_interests
    ADD CONSTRAINT unique_idea_company UNIQUE (idea_id, company_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (id);


--
-- Name: votes votes_unique_user_idea; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_unique_user_idea UNIQUE (idea_id, user_id);


--
-- Name: idx_notifications_recipient; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_recipient ON public.notifications USING btree (recipient_id, is_read);


--
-- Name: comments comments_idea_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_idea_id_fkey FOREIGN KEY (idea_id) REFERENCES public.ideas(id) ON DELETE CASCADE;


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: idea_interests idea_interests_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.idea_interests
    ADD CONSTRAINT idea_interests_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: idea_interests idea_interests_idea_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.idea_interests
    ADD CONSTRAINT idea_interests_idea_id_fkey FOREIGN KEY (idea_id) REFERENCES public.ideas(id) ON DELETE CASCADE;


--
-- Name: idea_tabs idea_tabs_idea_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.idea_tabs
    ADD CONSTRAINT idea_tabs_idea_id_fkey FOREIGN KEY (idea_id) REFERENCES public.ideas(id) ON DELETE CASCADE;


--
-- Name: ideas ideas_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ideas
    ADD CONSTRAINT ideas_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_idea_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_idea_id_fkey FOREIGN KEY (idea_id) REFERENCES public.ideas(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_recipient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: votes votes_idea_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_idea_id_fkey FOREIGN KEY (idea_id) REFERENCES public.ideas(id) ON DELETE CASCADE;


--
-- Name: votes votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict W5KUQJiJBAindlMCM0u3jUuKwbhmchcvfvqI1JSwOegC8ijqiv0LbY61ZDersDc

