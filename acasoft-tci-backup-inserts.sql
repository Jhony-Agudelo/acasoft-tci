--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance (
    id character varying(100) NOT NULL,
    student_id character varying(100) NOT NULL,
    course_id character varying(100) NOT NULL,
    date character varying(50) NOT NULL,
    status character varying(50) NOT NULL
);


ALTER TABLE public.attendance OWNER TO postgres;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id character varying(100) NOT NULL,
    nombre_curso character varying(255) NOT NULL,
    status character varying(50) NOT NULL,
    schedule jsonb
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    id character varying(100) NOT NULL,
    amount double precision NOT NULL,
    date character varying(50) NOT NULL,
    category character varying(100) NOT NULL,
    description text NOT NULL,
    recipient_name character varying(255),
    teacher_id character varying(100)
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- Name: guardians; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guardians (
    id character varying(100) NOT NULL,
    nombre_completo character varying(255) NOT NULL,
    direccion text NOT NULL,
    telefono character varying(100) NOT NULL,
    parentesco character varying(100) NOT NULL
);


ALTER TABLE public.guardians OWNER TO postgres;

--
-- Name: lesson_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lesson_plans (
    id character varying(100) NOT NULL,
    course_id character varying(100),
    week_start character varying(50),
    week_end character varying(50),
    topic character varying(255) NOT NULL,
    description text NOT NULL,
    resources jsonb,
    level character varying(50)
);


ALTER TABLE public.lesson_plans OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id character varying(100) NOT NULL,
    student_id character varying(100) NOT NULL,
    amount double precision NOT NULL,
    payment_date character varying(50) NOT NULL,
    period_covered character varying(100) NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id character varying(100) NOT NULL,
    documento_identidad character varying(100) NOT NULL,
    nombres character varying(255) NOT NULL,
    apellidos character varying(255) NOT NULL,
    fecha_nacimiento character varying(50),
    edad integer NOT NULL,
    colegio_origen character varying(255) NOT NULL,
    grado_escolar character varying(100),
    curso_actual character varying(255) NOT NULL,
    jornada_escolar character varying(50) NOT NULL,
    guardian_id character varying(100) NOT NULL,
    status character varying(50) NOT NULL,
    payment_deadline_date character varying(50) NOT NULL,
    course_id character varying(100),
    avatar_url text,
    payment_day integer DEFAULT 15 NOT NULL
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_settings (
    id character varying(100) NOT NULL,
    enrollment_open boolean NOT NULL,
    academic_year character varying(50) NOT NULL,
    institution_name character varying(255) NOT NULL,
    default_payment_day integer DEFAULT 15 NOT NULL
);


ALTER TABLE public.system_settings OWNER TO postgres;

--
-- Name: tracking_videos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tracking_videos (
    id character varying(100) NOT NULL,
    student_id character varying(100) NOT NULL,
    title character varying(255) NOT NULL,
    video_url text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tracking_videos OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    status character varying(50) NOT NULL,
    nombres character varying(255) NOT NULL,
    apellidos character varying(255) NOT NULL,
    telefono character varying(100),
    documento_identidad character varying(100),
    fecha_nacimiento character varying(50),
    direccion text,
    contacto_emergencia character varying(100),
    parentesco_contacto character varying(100),
    avatar_url text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: guardians; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420108_748', 'Yesenia vicuña Sánchez', 'Carrera 8C 15 15', '3155861443', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420112_391', 'Carolina Jaramillo', 'Calle 18b #975 tangarife 1', '3043503032', 'Mama');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420114_115', 'Mónica Paola Peña', 'Calle 16 # 4 b 51', '3223062196', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781123785557', 'Yesica Leandra Galvis Muñoz', 'Casa 23 Bloque 1 - Caimalito ', '3234646913', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420028_920', 'Alejandra', 'Calle 13 a # 6/60', '3223781960', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420076_947', 'Diana Marcela villa', 'Crr221e 03 Pedro Pablo bello', '3127938500', 'Mama');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420014_991', 'Jessica Fernández Sánchez', 'Cll 16a 8-53 el prado', '3122004261', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420063_44', 'Diana Ramirez', 'Carrera 8a # 15a-67', '3114101776', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420009_810', 'Alexandra Tabares Granada', 'Man 6 casa c 18a10 la milagrosa', '3215813316', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420011_599', 'Keren castaño rojas', 'CRA 10#8-34', '3117492360', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420065_106', 'Suli Montoya Gil', 'Carrera 6 # 5 32', '3122021368', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420050_844', 'Jennyfer Mosquera Vitola', 'CALLE 18E 5A- 76', '3145036574', 'MAMA');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420069_583', 'Jhesenia Henao Blandón', 'Transversal 7 número 7 101 barrio centro', '3132881912', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420016_35', 'Andrea Galvis Gómez', 'CRA 11a #6-37 San Cayetano', '3136056430', 'mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119419997_238', 'Marta Bedoya Osorio', 'Libertadores CRA 21#5a-22', '3122202347', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420018_740', 'Marcela González', 'Cra 4 A # 10-19 Buenos Aires', '3217998467', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420026_100', 'Mayra Orrego', 'Calle 16 # 8c47 Santa Fe', '3132445824', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420030_185', 'María José Cardona Cardona', 'Calle 16b#11a-36', '3127177916', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420036_135', 'Helem Julieth Maturana Velez', 'Caimalito Azufral #133', '3148738713', 'Hermana');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420038_721', 'Nubia Molina', 'Carrera 8a # 15 a 63 barrio almendros', '3106867021', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420040_963', 'Isabel Cristina Londoño', 'Calle 7b#368 bbsanfernando', '3196555868', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420044_717', 'Yeny Viviana González', 'CRA 8 # 9-50 barrio Restrepo', '3022377886', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420047_339', 'Jacqueline Salazar', 'Espancion norte', '3216151632', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420052_397', 'Aracelly Lema', 'Calle 10a número 6-21', '3012631733', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420054_909', 'Liliana Patricia Velásquez', 'Calle 17 # 11-63 el Prado', '3154698583', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420058_800', 'Diana Isabel Gutiérrez', 'Clle 15 # 6a-17 los almendros', '3041295257', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420061_463', 'Yaritza Alejandra Montoya Taborda', 'Calle 15 # 7a 40 barrio obrero', '3103229568', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420067_73', 'Karen Zuleta -Mercedes Suárez', 'CRA 8b #18b 45 tangarife 1', '3116175828', 'Madre - Abuela');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420074_528', 'Lina Acosta', 'Cra11 #18e18', '3127285910', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420077_492', 'Daniela Cañizales', 'Cra 10 18 b 61', '3228052848', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420079_353', 'Ana María Quintero Molina', 'Calle 16a número 6a-66', '3117377267', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420081_341', 'Diana Zulay Vera Marin', 'Caimalito centro casa 374A', '3145755953', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420083_784', 'Maria Alejandra Campiño Gómez', 'Cll16 #5c-45', '3128110005', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420085_186', 'Viviana Restrepo', 'Calle 13 n 4-39 los gavilanes', '3113317241', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420087_791', 'Jessica Londoño', 'Calle 14 # 2-73 el progreso', '3104905062', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420089_130', 'Devy Quintero', 'Calle 16a 8-59 El Prado', '3117894115', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420090_470', 'Gloria Isabel Velez', 'Caimalito centro casa 246', '3218500287 - 3127761662', 'Abuela');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420092_440', 'Leidy Ana Londoño G', 'Calle 8 n. 4-58 el Edén', '3213256275', 'Mama');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420094_311', 'Yamileth Restrepo', 'Calle 15 # 11-38', '3178812254', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420096_27', 'Laura Dahiana Vente Cañizales', 'Calle 16#11-17', '3148876885', 'Mama');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420099_49', 'Yeny Marcela Herrera', 'Cr9 n 8 38 la magdalena', '3125693824', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420101_232', 'Nataly Arango Acevedo', 'Calle 17 8 c 12 barrio el prado primer piso', '3145676764', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420105_932', 'Kelly Sánchez', 'CR 8 b #18b76 barrio/baiton gaviria', '3132552779', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420106_878', 'Diana Alexandra Chavarriaga Alzate', 'Cra 10# 8-43', '3118117256', 'Mama');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420056_256', 'Jessica Faisury Múnera Barco', 'Cra 8a #18b 28 bairon gaviria', '3118474411', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781282300990_758', 'Mayra Alejandra orrego', 'Calle 16 # 8 c 47 Santa Fe', 'Mamá', '1087559293');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420071_942', 'Pamela Contreras ortiz', 'Carrera 11 15 A 23 santa fe', '3217541156', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420024_204', 'Maria angelica alcalde', 'Calle 16ª #8-18 barrio los almendros', '3218360113', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420032_710', 'Natalia Dorado', 'Calle 18d n 9-58 tangarife 1', '3011189927', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420034_177', 'Carol Manuela Patiño', 'CRA 21 # 5-33', '3133707458', 'Mama');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420042_566', 'Manuela Me a', 'Calle 18B N9-27 tangarife 1 piso 2', '3205861350', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420022_293', 'Luz Omaira Fernández Suárez', 'Calle 9 #10.105 la magdalena', '3229718929', 'Mamá');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781119420110_423', 'Diana Alejandra Gil cano', 'Calle 16 n 8c 27 barrio Santa Fe', '3209992737', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781131930011', 'María José Zapata Toro', 'Carrera 8 #10-78 Barrio Restrepo (enseguida de las cabañas)', '3134940722', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781205687669', 'Etna Rocío Salazar', 'Carrera 8 12a 23 Balsillas', '3223877785', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781209339877', 'Jhony Alexander Ayala Vélez', 'Calle 16b 5c20 Barrio Ciprés', '3122395745', 'Padre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781278240609', 'Carlos Humberto León Ruiz', 'Carrera 8 #12b10 Balsillas', '3137201865', 'Padre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781282244549', 'Gloria Helena Daza Cano', 'Calle 10 #4-56 Barrio La playa', '3146665882', 'Madre');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781282300974_875', 'Marta Bedoya', 'Libertadores CRA 21 #5a-22', 'Madre', '1088536540');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781282300994_749', 'Maria cecilia Gomez Sanchez', 'Kra 6a  # 9-15 B/ Restrepo', 'Abuela Materna', '42021382');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781282300997_675', 'Hellem Maturana', 'Caimalito Azufral #133', 'Hermana', '1006439126');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781282300998_307', 'Luz dary durango ramos', 'Calle16 a #5c52 barrio cipres', 'Abuela', '42022474');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781282301006_134', 'Lorena rodriguez', 'Carrera 5a #9-37', 'Mama', '1005720181');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781282301011_858', 'NORMA JULIETH USMA ZAPATA', 'Calle 12 # 5A-19', 'MAMÁ', '1087548393');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781282301014_490', 'Aracelly lema', 'Calle 10a 6-21 Restrepo', 'Masre', '1087552913');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781282301035_681', 'Dahiana zapata', 'Calle 16 # 11 b 34 Pío doce', 'Tia', '1087559659');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781282301038_981', 'Huberney Hernández', 'Calle 8 a #7-26', 'Papá', '9764125');
INSERT INTO public.guardians (id, nombre_completo, direccion, telefono, parentesco) VALUES ('grd_1781282301052_519', 'Andrés Henao', 'Calle 17 N 8c12', 'Padre', '1036646968');


--
-- Data for Name: lesson_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.payments (id, student_id, amount, payment_date, period_covered) VALUES ('pay_1781280268127', 'std_1781278240609', 70000, '2026-06-12', 'Mensualidad Julio');


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563090', '1087563090', 'Alan', 'Muriel Bedoya', '19/7/2019', 5, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119419997_238', 'ACTIVE', '2026-06-10T19:23:40.005Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563714', '1087563714', 'Ana Sofía', 'Henao González', '6/4/2021', 4, 'Colegio La Real Academia', 'Pre jardin', 'N/A', 'Mañana', 'grd_1781119420018_740', 'ACTIVE', '2026-06-10T19:23:40.020Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562159', '1087562159', 'Celenne', 'Segura Orrego', '14/8/2017', 7, 'Colegio Nuestra Señora de la Presentación', 'Segundo', 'N/A', 'Mañana', 'grd_1781119420026_100', 'ACTIVE', '2026-06-10T19:23:40.027Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1138032440', '1138032440', 'Danilo', 'Polo Cardona', '31/1/2018', 7, 'Colegio Nuestra Señora de la Presentación', 'Segundo', 'N/A', 'Mañana', 'grd_1781119420030_185', 'ACTIVE', '2026-06-10T19:23:40.031Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562763', '1087562763', 'Dylan Stif', 'Osorio Velez', '17/8/2018', 6, 'Otro / Particular', 'Primero', 'N/A', 'Mañana', 'grd_1781119420036_135', 'ACTIVE', '2026-06-10T19:23:40.037Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1089632837', '1089632837', 'Emiliano', 'Echeverri Molina', '27/7/2017', 7, 'Colegio Nuestra Señora de la Presentación', 'Segundo', 'N/A', 'Mañana', 'grd_1781119420038_721', 'ACTIVE', '2026-06-10T19:23:40.039Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1089631385', '1089631385', 'Celeste', 'Antury', '22/2/2017', 8, 'Institución Educativa Alfonso López Pumarejo', 'Tercero', 'N/A', 'Mañana', 'grd_1781119420028_920', 'RETIRED', '2026-06-10T19:23:40.029Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086636930', '1086636930', 'Emily', 'Herrera Londoño', '5/8/2017', 7, 'Colegio Nuestra Señora de la Presentación', 'Segundo', 'N/A', 'Mañana', 'grd_1781119420040_963', 'ACTIVE', '2026-06-10T19:23:40.041Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562595', '1087562595', 'Amelia', 'Berrío Fernandez', '7/4/2018', 7, 'Institución Educativa Liceo Gabriela Mistral', 'Segundo', 'N/A', 'Mañana', 'grd_1781119420014_991', 'RETIRED', '2026-06-10T19:23:40.015Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562294', '1087562294', 'Hillary', 'Duque González', '7/10/2017', 7, 'Colegio Nuestra Señora de la Presentación', 'Segundo', 'N/A', 'Mañana', 'grd_1781119420044_717', 'ACTIVE', '2026-06-10T19:23:40.046Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1089538258', '1089538258', 'Isac', 'Duque Salazar', '11/4/2019', 6, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420047_339', 'ACTIVE', '2026-06-10T19:23:40.047Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562632', '1087562632', 'Jhoan Alexander', 'Londoño Lema', '12/5/2018', 7, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420052_397', 'ACTIVE', '2026-06-10T19:23:40.053Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086636523', '1086636523', 'Jhon', 'Sebastián Cortés', '27/10/2014', 10, 'Otro / Particular', 'Quinto', 'N/A', 'Mañana', 'grd_1781119420054_909', 'ACTIVE', '2026-06-10T19:23:40.055Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1089626548', '1089626548', 'Juan Miguel', 'Berrio Ramirez', '5/9/2015', 9, 'Otro / Particular', 'Cuarto', 'N/A', 'Mañana', 'grd_1781119420063_44', 'RETIRED', '2026-06-10T19:23:40.064Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1215969003', '1215969003', 'Joshua De La', 'Hoz Gutiérrez', '8/9/2018', 6, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420058_800', 'ACTIVE', '2026-06-10T19:23:40.059Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562247', '1087562247', 'Juan José', 'Parra Montoya', '13/9/2017', 7, 'Colegio Nuestra Señora de la Presentación', 'Segundo', 'N/A', 'Mañana', 'grd_1781119420061_463', 'ACTIVE', '2026-06-10T19:23:40.062Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563505', '1087563505', 'Luciana', 'Posada Zuleta', '13/10/2020', 4, 'Otro / Particular', 'Preescolar', 'N/A', 'Mañana', 'grd_1781119420067_73', 'ACTIVE', '2026-06-10T19:23:40.068Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562825', '1087562825', 'Justin', 'Betancourt Montoya', '18/10/2018', 6, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420065_106', 'RETIRED', '2026-06-10T19:23:40.066Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1019154875', '1019154875', 'Jeronimo', 'Cano Mosquera', '30/5/2018', 7, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420050_844', 'RETIRED', '2026-06-10T19:23:40.051Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563255', '1087563255', 'María Celeste', 'Carmona Henao', '8/1/2020', 5, 'Colegio Nuestra Señora de la Presentación', 'Transición', 'N/A', 'Mañana', 'grd_1781119420069_583', 'RETIRED', '2026-06-10T19:23:40.070Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563009', '1087563009', 'Alisson', 'Gómez Tabares', '11/4/2019', 6, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420009_810', 'RETIRED', '2026-06-10T19:23:40.010Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563204', '1087563204', 'Johan Thiago', 'Caro Múnera', '9/11/2019', 5, 'Colegio Nuestra Señora de la Presentación', 'Transición', 'N/A', 'Mañana', 'grd_1781119420056_256', 'ACTIVE', '2026-06-10T19:23:40.057Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563882', '1087563882', 'Alma Sophia', 'Correa Castaño', '26/8/2021', 3, 'Otro / Particular', 'Transición', 'N/A', 'Mañana', 'grd_1781119420011_599', 'RETIRED', '2026-06-10T19:23:40.013Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562661', '1087562661', 'Ana Sofia', 'Estrada Galvis', '7/6/2018', 7, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420016_35', 'RETIRED', '2026-06-10T19:23:40.017Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087560861', '1087560861', 'Anna Maríah', 'Rodríguez Castaño', '12/3/2016', 9, 'Institución Educativa Bernardo Arias Trujillo', 'Cuarto', 'N/A', 'Mañana', 'grd_1781119420011_599', 'RETIRED', '2026-06-10T19:23:40.021Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086637048', '1086637048', 'Antonella', 'Garzón Fernández', '11/6/2018', 7, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420022_293', 'RETIRED', '2026-06-10T19:23:40.023Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563950', '1087563950', 'Antonella', 'Rios Alcalde', '21/10/2021', 4, 'Otro / Particular', 'Prejardin', 'N/A', 'Mañana', 'grd_1781119420024_204', 'RETIRED', '2026-06-10T19:23:40.025Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086636498', '1086636498', 'Dereck Gabriel', 'Rendón Dorado', '15/9/2014', 10, 'Institución Educativa Liceo Gabriela Mistral', 'Quinto', 'N/A', 'Mañana', 'grd_1781119420032_710', 'RETIRED', '2026-06-10T19:23:40.033Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562952', '1087562952', 'Dulce', 'celeste Ramirez', '1/3/2019', 6, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420034_177', 'RETIRED', '2026-06-10T19:23:40.035Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1084564061', '1084564061', 'Emma', 'Jaramillo Mena', '4/1/2022', 3, 'Colegio La Real Academia', 'Pre jardín', 'N/A', 'Mañana', 'grd_1781119420042_566', 'RETIRED', '2026-06-10T19:23:40.043Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086637071', '1086637071', 'Jaris', 'Cortes García', '15/8/2018', 6, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420022_293', 'RETIRED', '2026-06-10T19:23:40.049Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1184463146', '1184463146', 'Juan Esteban', 'Correa Gil', '15/7/2015', 9, 'Institución Educativa Alfonso López Pumarejo', 'Tercero', 'N/A', 'Mañana', 'grd_1781119420011_599', 'RETIRED', '2026-06-10T19:23:40.060Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562992', '1087562992', 'María Salomé', 'Restrepo Acosta', '1/4/2019', 6, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420074_528', 'ACTIVE', '2026-06-10T19:23:40.075Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1089638020', '1089638020', 'Martín', 'Hincapié Cañizales', '14/3/2019', 6, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420077_492', 'ACTIVE', '2026-06-10T19:23:40.078Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562879', '1087562879', 'Mateo', 'Henao Quintero', '12/12/2018', 6, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420079_353', 'ACTIVE', '2026-06-10T19:23:40.080Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562401', '1087562401', 'Matías', 'Castaño Vera', '23/11/2017', 7, 'Otro / Particular', 'Segundo', 'N/A', 'Mañana', 'grd_1781119420081_341', 'ACTIVE', '2026-06-10T19:23:40.082Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086637042', '1086637042', 'Matías', 'Gil Campiño', '15/6/2018', 7, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420083_784', 'ACTIVE', '2026-06-10T19:23:40.084Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563929', '1087563929', 'Mauricio', 'Gómez Restrepo', '3/10/2021', 3, 'Colegio La Real Academia', 'Pre jardin', 'N/A', 'Mañana', 'grd_1781119420085_186', 'ACTIVE', '2026-06-10T19:23:40.086Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562905', '1087562905', 'Maximiliano', 'Vallecilla Londoño', '16/1/2019', 6, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420087_791', 'ACTIVE', '2026-06-10T19:23:40.088Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087564068', '1087564068', 'Miguel Ángel', 'Escobar Quintero', '10/1/2022', 3, 'Otro / Particular', 'Transición', 'N/A', 'Mañana', 'grd_1781119420089_130', 'ACTIVE', '2026-06-10T19:23:40.089Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086637004', '1086637004', 'Miguel Ángel', 'Patiño Muñoz', '22/2/2018', 7, 'Otro / Particular', 'Segundo', 'N/A', 'Mañana', 'grd_1781119420090_470', 'ACTIVE', '2026-06-10T19:23:40.091Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562886', '1087562886', 'Nahiara', 'Gómez Londoño', '21/12/2018', 6, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420092_440', 'ACTIVE', '2026-06-10T19:23:40.093Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086636918', '1086636918', 'Nicolás', 'Mejia Restrepo', '2/7/2017', 7, 'Colegio Nuestra Señora de la Presentación', 'Segundo', 'N/A', 'Mañana', 'grd_1781119420094_311', 'ACTIVE', '2026-06-10T19:23:40.095Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562744', '1087562744', 'Paulina', 'Machado Vente', '17/8/2018', 6, 'Institución Educativa Alfonso López Pumarejo', 'Primero', 'N/A', 'Mañana', 'grd_1781119420096_27', 'ACTIVE', '2026-06-10T19:23:40.097Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086637063', '1086637063', 'Samantha', 'Martínez Herrera', '24/7/0018', 7, 'Otro / Particular', 'Primero', 'N/A', 'Mañana', 'grd_1781119420099_49', 'ACTIVE', '2026-06-10T19:23:40.100Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1037675757', '1037675757', 'Samuel', 'Henao Arango', '18/12/2021', 3, 'Otro / Particular', 'Pre Jardín', 'N/A', 'Mañana', 'grd_1781119420101_232', 'ACTIVE', '2026-06-10T19:23:40.102Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1089638646', '1089638646', 'Santiago', 'Duque González', '27/5/2019', 6, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420044_717', 'ACTIVE', '2026-06-10T19:23:40.104Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563024', '1087563024', 'Sara', 'Montoya Sánchez', '1/5/2019', 6, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420105_932', 'ACTIVE', '2026-06-10T19:23:40.106Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562783', '1087562783', 'Sophia', 'Medina Chavarriaga', '5/9/2018', 6, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781119420106_878', 'ACTIVE', '2026-06-10T19:23:40.107Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1113871430', '1113871430', 'Thiago', 'Diaz Vicuña', '23/11/2021', 3, 'Otro / Particular', 'Pre-jardín', 'N/A', 'Mañana', 'grd_1781119420108_748', 'ACTIVE', '2026-06-10T19:23:40.109Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562818', '1087562818', 'Valery', 'Osorio Jaramillo', '21/10/2018', 6, 'Otro / Particular', 'N/A', 'N/A', 'Mañana', 'grd_1781119420112_391', 'ACTIVE', '2026-06-10T19:23:40.113Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563799', '1087563799', 'Victoria', 'Molina Peña', '26/6/2021', 4, 'Otro / Particular', 'Primero', 'N/A', 'Mañana', 'grd_1781119420114_115', 'ACTIVE', '2026-06-10T19:23:40.114Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1781123785557', '1086637089', 'Emilio ', 'Castaño Galvis', '2019-03-05', 7, 'Institución Educativa Liceo Gabriela Mistral', 'Segundo', 'Kids Starter (Nivel A1.1)', 'TARDE', 'grd_1781123785557', 'REGISTERED', '2026-07-02', NULL, NULL, 2);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087556687', '1087556687', 'Mariana', 'Arroyave villa', '10/1/2012', 13, 'Institución Educativa Alfonso López Pumarejo', 'Sexto', 'N/A', 'Mañana', 'grd_1781119420076_947', 'RETIRED', '2026-06-10T19:23:40.076Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086636919', '1086636919', 'Samantha', 'Betancourt Montoya', '26/6/2017', 8, 'Colegio Nuestra Señora de la Presentación', 'Segundo', 'N/A', 'Mañana', 'grd_1781119420065_106', 'RETIRED', '2026-06-10T19:23:40.098Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562460', '1087562460', 'Maria Jose', 'Holguín Contreras', '26/12/2017', 7, 'Institución Educativa Liceo Gabriela Mistral', 'Segundo', 'N/A', 'Mañana', 'grd_1781119420071_942', 'RETIRED', '2026-06-10T19:23:40.072Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087561829', '1087561829', 'Valerie', 'Rivera Gil', '23/3/2017', 8, 'Institución Educativa Liceo Gabriela Mistral', 'Tercero', 'N/A', 'Mañana', 'grd_1781119420110_423', 'RETIRED', '2026-06-10T19:23:40.111Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1781131930011', '1087563949', 'Martín', 'Llanos Zapata', '2021-08-21', 4, 'Hogar Infantil Comunitario La Virginia (ICBF)', 'Jardín / Guardería', 'Kids Starter (Nivel A1.1)', 'TARDE', 'grd_1781131930011', 'REGISTERED', '2026-07-02', NULL, NULL, 2);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1781205687669', '1089644072', 'Maximiliano', 'Quintero Salazar', '2021-09-13', 4, 'Colegio Nuestra Señora de la Presentación', 'Preescolar / Transición', 'Kids Starter (Nivel A1.1)', 'TARDE', 'grd_1781205687669', 'REGISTERED', '2026-07-02', NULL, NULL, 2);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1781209339877', '1087563487', 'Maximiliano', 'Ayala Álvarez', '2020-10-09', 5, 'Colegio Nuestra Señora de la Presentación', 'Preescolar / Transición', 'Kids Starter (Nivel A1.1)', 'TARDE', 'grd_1781209339877', 'REGISTERED', '2026-07-02', NULL, NULL, 2);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1781278240609', '1087560293', 'Antonella', 'León Alzate', '2015-08-01', 10, 'Colegio Nuestra Señora de la Presentación', 'Quinto', 'Kids Starter (Nivel A1.1)', 'TARDE', 'grd_1781278240609', 'REGISTERED', '2026-08-02', NULL, NULL, 2);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1781282244550', '1089943179', 'Valeria', 'García Daza', '2021-02-18', 5, 'Colegio Nuestra Señora de la Presentación', 'Preescolar / Transición', 'Kids Starter (Nivel A1.1)', 'TARDE', 'grd_1781282244549', 'REGISTERED', '2026-07-02', NULL, NULL, 2);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563828', '1087563828', 'Allison', 'Gonzalez Castaño', '13/7/2021', 4, 'Otro / Particular', 'Transicion', 'N/A', 'Mañana', 'grd_1781282300974_875', 'ACTIVE', '2026-06-12T16:38:20.979Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086636866', '1086636866', 'Allyn Yarianna', 'Benjumea Pulgarin', '20/1/2017', 9, 'Otro / Particular', 'Cuarto', 'N/A', 'Mañana', 'grd_1781282300974_875', 'ACTIVE', '2026-06-12T16:38:20.983Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086637051', '1086637051', 'Antonela', 'Vanegas Giraldo', '21/6/2018', 7, 'Colegio Nuestra Señora de la Presentación', 'Tercero', 'N/A', 'Mañana', 'grd_1781282300974_875', 'ACTIVE', '2026-06-12T16:38:20.987Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086636974', '1086636974', 'Aythana', 'Osorio villada', '26/12/2017', 8, 'Colegio Nuestra Señora de la Presentación', 'Tercero', 'N/A', 'Mañana', 'grd_1781282300974_875', 'ACTIVE', '2026-06-12T16:38:20.989Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562633', '1087562633', 'Celeste', 'Gómez Álvarez', '5/5/2018', 7, 'Colegio Nuestra Señora de la Presentación', 'Tercero', 'N/A', 'Mañana', 'grd_1781282300990_758', 'ACTIVE', '2026-06-12T16:38:20.992Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563218', '1087563218', 'Dulce Maria', 'Villa Gomez', '24/11/2019', 6, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781282300994_749', 'ACTIVE', '2026-06-12T16:38:20.995Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087562224', '1087562224', 'Emiliana', 'Hincapie Durango', '9/9/2017', 8, 'Colegio Nuestra Señora de la Presentación', 'Tercero', 'N/A', 'Mañana', 'grd_1781282300998_307', 'ACTIVE', '2026-06-12T16:38:20.999Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1128908202', '1128908202', 'Emiliano', 'Valderrama Cano', '19/5/2014', 119, 'Colegio Nuestra Señora de la Presentación', '7B', 'N/A', 'Mañana', 'grd_1781282300998_307', 'ACTIVE', '2026-06-12T16:38:21.002Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087564478', '1087564478', 'Gael', 'Taborda Vélez', '6/1/2023', 3, 'Otro / Particular', 'No aplica', 'N/A', 'Mañana', 'grd_1781282300974_875', 'ACTIVE', '2026-06-12T16:38:21.004Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1104551509', '1104551509', 'Iam Santiago', 'Lopez Rodriguez', '7/4/2015', 10, 'Colegio Nuestra Señora de la Presentación', 'Sexto', 'N/A', 'Mañana', 'grd_1781282301006_134', 'ACTIVE', '2026-06-12T16:38:21.007Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1089622330', '1089622330', 'Isaac', 'Montoya Restrepo', '23/1/2014', 12, 'Institución Educativa Alfonso López Pumarejo', '7', 'N/A', 'Mañana', 'grd_1781282300974_875', 'ACTIVE', '2026-06-12T16:38:21.009Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1089638258', '1089638258', 'Isac', 'Duque Salazar', '11/4/2019', 6, 'Colegio Nuestra Señora de la Presentación', 'Segundo', 'N/A', 'Mañana', 'grd_1781282300974_875', 'ACTIVE', '2026-06-12T16:38:21.010Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563820', '1087563820', 'Ismael', 'García Usma', '8/7/2021', 4, 'Colegio Nuestra Señora de la Presentación', 'TRANSICIÓN', 'N/A', 'Mañana', 'grd_1781282301011_858', 'ACTIVE', '2026-06-12T16:38:21.012Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087564297', '1087564297', 'Ivana', 'Ríos Sánchez', '3/8/2022', 3, 'Otro / Particular', 'No aplica', 'N/A', 'Mañana', 'grd_1781282300974_875', 'ACTIVE', '2026-06-12T16:38:21.013Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087552913', '1087552913', 'Jhoan Alexander', 'Londoño Lema', '12/5/2018', 7, 'Colegio Nuestra Señora de la Presentación', 'Segundo', 'N/A', 'Mañana', 'grd_1781282301014_490', 'ACTIVE', '2026-06-12T16:38:21.015Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563671', '1087563671', 'Juan Pablo', 'Marín Zapata', '4/3/2021', 4, 'Colegio Nuestra Señora de la Presentación', 'Transición', 'N/A', 'Mañana', 'grd_1781282300990_758', 'ACTIVE', '2026-06-12T16:38:21.020Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563383', '1087563383', 'Juan Sebastián ', 'Arredondo Ríos', '14/7/2020', 5, 'Colegio Nuestra Señora de la Presentación', 'Transición', 'N/A', 'Mañana', 'grd_1781282300990_758', 'ACTIVE', '2026-06-12T16:38:21.022Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563050', '1087563050', 'Juana Sofía', 'Hincapié Llóreda', '28/5/2019', 6, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781282301006_134', 'ACTIVE', '2026-06-12T16:38:21.024Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087564166', '1087564166', 'Luciana', 'Arroyave Marín', '10/4/2022', 3, 'Otro / Particular', 'Pre- jardin', 'N/A', 'Mañana', 'grd_1781282300990_758', 'ACTIVE', '2026-06-12T16:38:21.025Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087561066', '1087561066', 'Luciana', 'Mejia Aguirre', '7/5/2016', 9, 'Colegio Nuestra Señora de la Presentación', 'Cuarto', 'N/A', 'Mañana', 'grd_1781282301006_134', 'ACTIVE', '2026-06-12T16:38:21.026Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563583', '1087563583', 'Luciana', 'Rua', '18/12/2020', 5, 'Colegio Nuestra Señora de la Presentación', 'Trancision', 'N/A', 'Mañana', 'grd_1781282300974_875', 'ACTIVE', '2026-06-12T16:38:21.029Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1089638628', '1089638628', 'Maria Paula', 'Benjumea Rodriguez', '29/4/2019', 6, 'Institución Educativa Liceo Gabriela Mistral', 'Segundo', 'N/A', 'Mañana', 'grd_1781282301006_134', 'ACTIVE', '2026-06-12T16:38:21.030Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087559226', '1087559226', 'Martín', 'Gutiérrez Florez', '9/7/2014', 11, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781282300990_758', 'ACTIVE', '2026-06-12T16:38:21.032Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1234790221', '1234790221', 'Mateo', 'Pérez Montaño', '25/7/2016', 9, 'Institución Educativa Alfonso López Pumarejo', 'Cuarto', 'N/A', 'Mañana', 'grd_1781282301035_681', 'ACTIVE', '2026-06-12T16:38:21.036Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563010', '1087563010', 'Matías', 'Hernández Valencia', '8/4/2019', 6, 'Colegio Nuestra Señora de la Presentación', 'Segundo', 'N/A', 'Mañana', 'grd_1781282301038_981', 'ACTIVE', '2026-06-12T16:38:21.040Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086636765', '1086636765', 'Matías', 'Vásquez Carrion', '31/3/2016', 9, 'Colegio Nuestra Señora de la Presentación', 'Quinto', 'N/A', 'Mañana', 'grd_1781282300974_875', 'ACTIVE', '2026-06-12T16:38:21.041Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086636683', '1086636683', 'Nikolas', 'Marín Rojas', '6/11/2015', 10, 'Colegio Nuestra Señora de la Presentación', 'Quinto', 'N/A', 'Mañana', 'grd_1781282300998_307', 'ACTIVE', '2026-06-12T16:38:21.048Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087563153', '1087563153', 'Samantha', 'Gil Cubillos', '4/1/2019', 6, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781282300974_875', 'ACTIVE', '2026-06-12T16:38:21.050Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1087561099', '1087561099', 'Samir', 'Velásquez Rojas', '21/6/2016', 9, 'Colegio Nuestra Señora de la Presentación', 'Cuarto', 'N/A', 'Mañana', 'grd_1781282300998_307', 'ACTIVE', '2026-06-12T16:38:21.052Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1037676757', '1037676757', 'Samuel', 'Henao Arango', '18/12/2021', 4, 'Otro / Particular', 'Jardin', 'N/A', 'Mañana', 'grd_1781282301052_519', 'ACTIVE', '2026-06-12T16:38:21.053Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086636800', '1086636800', 'Samuel', 'Marulanda Galeano', '20/7/2016', 9, 'Colegio Nuestra Señora de la Presentación', 'Cuarto', 'N/A', 'Mañana', 'grd_1781282301006_134', 'ACTIVE', '2026-06-12T16:38:21.055Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086636461', '1086636461', 'Sariana', 'Muñoz Correa', '9/7/2009', 11, 'Colegio Nuestra Señora de la Presentación', '7', 'N/A', 'Mañana', 'grd_1781282300974_875', 'ACTIVE', '2026-06-12T16:38:21.058Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1086637297', '1086637297', 'Yhojan Steban', 'Zapata Carvajal', '12/5/2020', 5, 'Colegio Nuestra Señora de la Presentación', 'Primero', 'N/A', 'Mañana', 'grd_1781282301006_134', 'ACTIVE', '2026-06-12T16:38:21.063Z', NULL, NULL, 15);
INSERT INTO public.students (id, documento_identidad, nombres, apellidos, fecha_nacimiento, edad, colegio_origen, grado_escolar, curso_actual, jornada_escolar, guardian_id, status, payment_deadline_date, course_id, avatar_url, payment_day) VALUES ('std_1184463212', '1184463212', 'Yurly Salomé', 'Urriago Veloza', '13/2/2017', 9, 'Otro / Particular', 'Cuarto', 'N/A', 'Mañana', 'grd_1781282300974_875', 'ACTIVE', '2026-06-12T16:38:21.065Z', NULL, NULL, 15);


--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.system_settings (id, enrollment_open, academic_year, institution_name, default_payment_day) VALUES ('global_settings', true, '2026', 'TCI - Taller Creativo De Inglés', 2);


--
-- Data for Name: tracking_videos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tracking_videos (id, student_id, title, video_url, created_at) VALUES ('trk_1781279909714', 'std_1087564068', 'Seguimiento Abril', 'https://drive.google.com/file/d/15E8pFCzV5i30Il5JCBYoWlfeCGRjKj8d/view?usp=sharing', '2026-06-12 15:58:31.104');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, email, password_hash, role, status, nombres, apellidos, telefono, documento_identidad, fecha_nacimiento, direccion, contacto_emergencia, parentesco_contacto, avatar_url) VALUES ('usr_admin', 'jhony.agudelo@tci.com', '$2b$10$kD5xMDkIXEWt0YGDEPvnDe2merErxYB3hK.vGVFseqSh7xnGGzGZ6', 'ADMIN', 'ACTIVE', 'Jhony Estevan', 'Agudelo', '3174682253', '1004627290', '14/06/1998', 'Calle 16A #8-75 El Prado', '3197927849', 'Esposa Admin', NULL);
INSERT INTO public.users (id, email, password_hash, role, status, nombres, apellidos, telefono, documento_identidad, fecha_nacimiento, direccion, contacto_emergencia, parentesco_contacto, avatar_url) VALUES ('usr_t1', 'sara.fernandez@tci.com', '$2b$10$cqgKpLj8Tv/MuaB.RpyJROn.WIIXCQiBmKjkZBeIi8PD0ogqMVYEa', 'TEACHER', 'ACTIVE', 'Sara', 'Fernández Sánchez', '3137814442', '1087550216', '27/octubre/2006', 'Carrera 6a #6-42 Barrio Bavaria', '3126222311', 'Mamá Maestro', NULL);
INSERT INTO public.users (id, email, password_hash, role, status, nombres, apellidos, telefono, documento_identidad, fecha_nacimiento, direccion, contacto_emergencia, parentesco_contacto, avatar_url) VALUES ('usr_t2', 'mariana.usuga@tci.com', '$2b$10$q5IKfGH7H7b7JLXXYH2II.a/hIlyGoAOY5vmucZDa5ORnMCVHgT5m', 'TEACHER', 'ACTIVE', 'Mariana', 'Usuga Marmolejo', '3103752612', '1088240764', '1/julio/2004', 'CRA 21 #3-14 Los libertadores', '3182430900', 'Mamá maestro', NULL);
INSERT INTO public.users (id, email, password_hash, role, status, nombres, apellidos, telefono, documento_identidad, fecha_nacimiento, direccion, contacto_emergencia, parentesco_contacto, avatar_url) VALUES ('usr_t4', 'luisa.canizales@tci.com', '$2b$10$qOnduLpWheUEqO5tArom6ehi5Okm0RbE.pZ0bQE7XTn4wKPwvLyUW', 'DIRECTOR', 'ACTIVE', 'Luisa Fernanda', 'Cañizales Ossa', '3197927849', '1007220836', '1/junio/1999', 'Calle 16A #8-75 El Prado', '3174682253', 'Esposo directora', NULL);
INSERT INTO public.users (id, email, password_hash, role, status, nombres, apellidos, telefono, documento_identidad, fecha_nacimiento, direccion, contacto_emergencia, parentesco_contacto, avatar_url) VALUES ('usr_t3', 'isabella.castaneda@tci.com', '$2b$10$AzyhKo6paXNPJ3ACF5Un0.wxDs6Q77if9U4TqG4JUTVc9SfEyzvtS', 'TEACHER', 'ACTIVE', 'Isabella', 'Castañeda Galvis', '3148450317', '1086635038', '27/noviembre/2007', 'Calle 19a # 11-22 Expansion norte', '3215678861', 'Mamá Maestro', NULL);


--
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: guardians guardians_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guardians
    ADD CONSTRAINT guardians_pkey PRIMARY KEY (id);


--
-- Name: lesson_plans lesson_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_plans
    ADD CONSTRAINT lesson_plans_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: students students_documento_identidad_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_documento_identidad_key UNIQUE (documento_identidad);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (id);


--
-- Name: tracking_videos tracking_videos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_videos
    ADD CONSTRAINT tracking_videos_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: attendance attendance_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: attendance attendance_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: expenses expenses_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: lesson_plans lesson_plans_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_plans
    ADD CONSTRAINT lesson_plans_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payments payments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: students students_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE SET NULL;


--
-- Name: students students_guardian_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_guardian_id_fkey FOREIGN KEY (guardian_id) REFERENCES public.guardians(id) ON DELETE CASCADE;


--
-- Name: tracking_videos tracking_videos_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracking_videos
    ADD CONSTRAINT tracking_videos_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

