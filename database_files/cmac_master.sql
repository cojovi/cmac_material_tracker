PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE builders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
INSERT INTO builders VALUES(1,'American Legend');
INSERT INTO builders VALUES(2,'Beazer Homes');
INSERT INTO builders VALUES(3,'Bridge Homes');
INSERT INTO builders VALUES(4,'Cadence Homes');
INSERT INTO builders VALUES(5,'M/I Homes');
INSERT INTO builders VALUES(6,'Olivia Clark');
INSERT INTO builders VALUES(7,'Rockwell Homes');
INSERT INTO builders VALUES(8,'TreeHouse Homes');
INSERT INTO builders VALUES(9,'TruLife Homes');
INSERT INTO builders VALUES(10,'Brightland Homes');
INSERT INTO builders VALUES(11,'Century Community Homes');
INSERT INTO builders VALUES(12,'Graham Hart Homes');
INSERT INTO builders VALUES(13,'Grand Homes');
INSERT INTO builders VALUES(14,'Integrity Group');
INSERT INTO builders VALUES(15,'Meritage Homes');
INSERT INTO builders VALUES(16,'Our Country Homes');
INSERT INTO builders VALUES(17,'Trinity Classic Homes');
INSERT INTO builders VALUES(18,'Windsor Homes');
INSERT INTO builders VALUES(19,'All American');
INSERT INTO builders VALUES(20,'Astoria Homes');
INSERT INTO builders VALUES(21,'Atrium Fine Homes');
INSERT INTO builders VALUES(22,'B-More Custom');
INSERT INTO builders VALUES(23,'BB Living Homes');
INSERT INTO builders VALUES(24,'Biltmore Homes');
INSERT INTO builders VALUES(25,'Blue Ribbon Homes');
INSERT INTO builders VALUES(26,'Bricktown Custom');
INSERT INTO builders VALUES(27,'Bridgetower Homes');
INSERT INTO builders VALUES(28,'Build Better');
INSERT INTO builders VALUES(29,'Camden Homes');
INSERT INTO builders VALUES(30,'Cameron Classic Homes');
INSERT INTO builders VALUES(31,'Carlos Kimbrell');
INSERT INTO builders VALUES(32,'Chesmar Homes');
INSERT INTO builders VALUES(33,'City Park');
INSERT INTO builders VALUES(34,'Country Road Homes');
INSERT INTO builders VALUES(35,'Create Modern Homes');
INSERT INTO builders VALUES(36,'DR Horton');
INSERT INTO builders VALUES(37,'DSH Homes');
INSERT INTO builders VALUES(38,'David Weekly');
INSERT INTO builders VALUES(39,'Diamond P Builders');
INSERT INTO builders VALUES(40,'Direct Residential Homes');
INSERT INTO builders VALUES(41,'Dunhill');
INSERT INTO builders VALUES(42,'Encore Homes');
INSERT INTO builders VALUES(43,'Ergo Construction');
INSERT INTO builders VALUES(44,'First Texas');
INSERT INTO builders VALUES(45,'Histor Maker / ONM');
INSERT INTO builders VALUES(46,'Impression Homes');
INSERT INTO builders VALUES(47,'Jody Jones');
INSERT INTO builders VALUES(48,'Joseph Cameron Homes');
INSERT INTO builders VALUES(49,'K Hovanian');
INSERT INTO builders VALUES(50,'Kanengiser Homes');
INSERT INTO builders VALUES(51,'Kirlin Custon');
INSERT INTO builders VALUES(52,'LGI Homes');
INSERT INTO builders VALUES(53,'Landon Homes');
INSERT INTO builders VALUES(54,'Lennar DFW');
INSERT INTO builders VALUES(55,'Lillian Custom Homes');
INSERT INTO builders VALUES(56,'Mark Cooper');
INSERT INTO builders VALUES(57,'Mattamy Homes');
INSERT INTO builders VALUES(58,'Nashwood Homes');
INSERT INTO builders VALUES(59,'National Home Corp.');
INSERT INTO builders VALUES(60,'Netze Homes / Fluis DBT');
INSERT INTO builders VALUES(61,'New Pad');
INSERT INTO builders VALUES(62,'OBCH');
INSERT INTO builders VALUES(63,'Peach Custom Homes');
INSERT INTO builders VALUES(64,'Perry Homes');
INSERT INTO builders VALUES(65,'Personal House');
INSERT INTO builders VALUES(66,'Providential Homes');
INSERT INTO builders VALUES(67,'Rick Freebier');
INSERT INTO builders VALUES(68,'Riverside');
INSERT INTO builders VALUES(69,'Ron Davis Custom');
INSERT INTO builders VALUES(70,'Shaddock Homes');
INSERT INTO builders VALUES(71,'Southern Elegence');
INSERT INTO builders VALUES(72,'Southern impression Homes');
INSERT INTO builders VALUES(73,'Stonefield Homes');
INSERT INTO builders VALUES(74,'Sumeer Homes');
INSERT INTO builders VALUES(75,'Sweet Pearl Construction');
INSERT INTO builders VALUES(76,'The New Modern House');
INSERT INTO builders VALUES(77,'Thoroughbred Homes');
INSERT INTO builders VALUES(78,'Tilson Custom Homes');
INSERT INTO builders VALUES(79,'Travis Homes');
INSERT INTO builders VALUES(80,'Trile Homes');
INSERT INTO builders VALUES(81,'Union Main');
INSERT INTO builders VALUES(82,'West River Homes');
INSERT INTO builders VALUES(83,'William Ryan Homes');
INSERT INTO builders VALUES(84,'Willow Creek Homes');
INSERT INTO builders VALUES(85,'Wind and Water Homes');
CREATE TABLE employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL UNIQUE,
            team TEXT NOT NULL CHECK(team IN ('CMAC','Builder')) DEFAULT 'CMAC',
            email TEXT,
            phone TEXT
        );
INSERT INTO employees VALUES(1,'Faith','CMAC',NULL,NULL);
INSERT INTO employees VALUES(2,'Italia Mireles','CMAC','italiam@cmacroofing.com','817-818-8396');
INSERT INTO employees VALUES(3,'Jeanette','CMAC',NULL,NULL);
INSERT INTO employees VALUES(4,'Valerie Balderrama','CMAC','valerieb@cmacroofing.com',NULL);
INSERT INTO employees VALUES(5,'Aaron Garcia','CMAC','aarong@cmacroofing.com','817-896-65612');
INSERT INTO employees VALUES(6,'Abel Salazar','CMAC','abels@cmacroofing.com','214-533-3078');
INSERT INTO employees VALUES(7,'Albert Pecina','CMAC','albertp@cmacroofing.com','+18177512041');
INSERT INTO employees VALUES(8,'Alfredo Sandoval','CMAC','alfredos@cmacroofing.com',NULL);
INSERT INTO employees VALUES(9,'Allan Aviles','CMAC','allan@cmacroofing.com',NULL);
INSERT INTO employees VALUES(10,'Alondra Flores','CMAC','alondraf@cmacroofing.com','+18172102493');
INSERT INTO employees VALUES(11,'Amy Havenor','CMAC','amyh@cmacroofing.com','214-734-2717');
INSERT INTO employees VALUES(12,'Anna Skwierinski','CMAC','annas@cmacroofing.com',NULL);
INSERT INTO employees VALUES(13,'Arnold Guevara','CMAC','arnoldg@cmacroofing.com','713-446-8223');
INSERT INTO employees VALUES(14,'Ashlee Eaton','CMAC','ashlee@cmacroofing.com','2146364118');
INSERT INTO employees VALUES(15,'Avery West','CMAC','averyw@cmacroofing.com',NULL);
INSERT INTO employees VALUES(16,'Bailey Poe','CMAC','baileyp@cmacroofing.com','(806) 576-9710');
INSERT INTO employees VALUES(17,'Billy Nicholson','CMAC','billyn@cmacroofing.com','+16788990095');
INSERT INTO employees VALUES(18,'Brett Russell','CMAC','brettr@cmacroofing.com','+12145297537');
INSERT INTO employees VALUES(19,'Brock Johnston','CMAC','brock@cmacroofing.com',NULL);
INSERT INTO employees VALUES(20,'Cassidy Hortman','CMAC','cassidyh@cmacroofing.com',NULL);
INSERT INTO employees VALUES(21,'Charles Marlow','CMAC','charlesm@cmacroofing.com',NULL);
INSERT INTO employees VALUES(22,'Chasity Jones','CMAC','chasityj@cmacroofing.com','940-393-9157');
INSERT INTO employees VALUES(23,'Chris Reynolds','CMAC','chrisr@cmacroofing.com','+12817708926');
INSERT INTO employees VALUES(24,'Chris Harrison','CMAC','chrish@cmacroofing.com',NULL);
INSERT INTO employees VALUES(25,'Chris Singleton','CMAC','chriss@cmacroofing.com','+12148768630');
INSERT INTO employees VALUES(26,'Christian Sommer','CMAC','csommer@cmacroofing.com','+12818508678');
INSERT INTO employees VALUES(27,'Christian Viveiros','CMAC','christian@cmacroofing.com','8174717854');
INSERT INTO employees VALUES(28,'Clayton Bradfield','CMAC','claytonb@cmacroofing.com','214-545-2279');
INSERT INTO employees VALUES(29,'Cody Viveiros','CMAC','codyv@cmacroofing.com','8177512041');
INSERT INTO employees VALUES(30,'Craig Hamilton','CMAC','acquisition@cmacroofing.com','928-671-1126');
INSERT INTO employees VALUES(31,'Daniel Lara','CMAC','daniell@cmacroofing.com','+18179406899');
INSERT INTO employees VALUES(32,'Daniel Arreola','CMAC','daniela@cmacroofing.com',NULL);
INSERT INTO employees VALUES(33,'Daniela Rivera','CMAC','danielar@cmacroofing.com','817 925 6177');
INSERT INTO employees VALUES(34,'David Havenor','CMAC','davidh@cmacroofing.com','+12148834670');
INSERT INTO employees VALUES(35,'David Tresemer','CMAC','Davidt@cmacroofing.com','(417) 483-8706');
INSERT INTO employees VALUES(36,'Dulce Munoz','CMAC','candym@cmacroofing.com',NULL);
INSERT INTO employees VALUES(37,'Edwin Escobar','CMAC','edwine@cmacroofing.com','(682) 521-7722');
INSERT INTO employees VALUES(38,'Eric Francis','CMAC','ericf@cmacroofing.com',NULL);
INSERT INTO employees VALUES(39,'Evencio Gaona','CMAC','evenciog@cmacroofing.com','+18175250294');
INSERT INTO employees VALUES(40,'Faith Mahan','CMAC','faith@cmacroofing.com','+18179629018');
INSERT INTO employees VALUES(41,'Grant Gamez','CMAC','grantg@cmacroofing.com',NULL);
INSERT INTO employees VALUES(42,'Hugo Sandia','CMAC','hugos@cmacroofing.com',NULL);
INSERT INTO employees VALUES(43,'Hunter Powers','CMAC','hunterp@cmacroofing.com',NULL);
INSERT INTO employees VALUES(44,'Ingrid Blancarte','CMAC','ingridb@cmacroofing.com','+19722617493');
INSERT INTO employees VALUES(46,'Ivan Guadiana','CMAC','ivang@cmacroofing.com',NULL);
INSERT INTO employees VALUES(47,'Ivette Sanchez','CMAC','ivettes@cmacroofing.com','(682)336-3848');
INSERT INTO employees VALUES(48,'Ivis Aviles','CMAC','ivis@cmacroofing.com',NULL);
INSERT INTO employees VALUES(49,'Jace Hobbs','CMAC','jace@cmacroofing.com','+16825517020');
INSERT INTO employees VALUES(50,'Jared Hobbs','CMAC','jared@cmacroofing.com',NULL);
INSERT INTO employees VALUES(51,'Jason Carson','CMAC','jasonc@cmacroofing.com',NULL);
INSERT INTO employees VALUES(52,'Jason Boehm','CMAC','jasonb@cmacroofing.com',NULL);
INSERT INTO employees VALUES(53,'Jason Gamez','CMAC','jason@cmacroofing.com',NULL);
INSERT INTO employees VALUES(54,'Javier Sosa','CMAC','javiers@cmacroofing.com','+14698068207');
INSERT INTO employees VALUES(55,'Jay Narke','CMAC','jayn@cmacroofing.com','+12146427739');
INSERT INTO employees VALUES(56,'Jeanette Pena','CMAC','jeanettep@cmacroofing.com','940-465-9354');
INSERT INTO employees VALUES(57,'Jeninne Glass','CMAC','jeninneg@cmacroofing.com',NULL);
INSERT INTO employees VALUES(58,'Jenn Ridgeway','CMAC','jennr@cmacroofing.com','+14692309547');
INSERT INTO employees VALUES(59,'Jeremy Smith','CMAC','jeremys@cmacroofing.com','817-614-2199');
INSERT INTO employees VALUES(60,'Jesus Salazar','CMAC','jesuss@cmacroofing.com','214-418-7109');
INSERT INTO employees VALUES(61,'Joe Coker','CMAC','joec@cmacroofing.com','+18172286924');
INSERT INTO employees VALUES(62,'John Rogers','CMAC','johnr@cmacroofing.com',NULL);
INSERT INTO employees VALUES(63,'Johnny Thacker','CMAC','johnnyt@cmacroofing.com',NULL);
INSERT INTO employees VALUES(64,'Jonathan Guerra','CMAC','jonathang@cmacroofing.com','903-474-1073');
INSERT INTO employees VALUES(65,'Jonathan Haigwood','CMAC','jonathanh@cmacroofing.com','+1 (817) 751-3389');
INSERT INTO employees VALUES(66,'Jonni Torres','CMAC','jonni@cmacroofing.com','+1 (817) 729-1605');
INSERT INTO employees VALUES(67,'Jordan West','CMAC','jordanw@cmacroofing.com',NULL);
INSERT INTO employees VALUES(68,'Jorge Marquez','CMAC','jorgem@cmacroofing.com',NULL);
INSERT INTO employees VALUES(69,'Jose Luis Moreno','CMAC','josem@cmacroofing.com','+14692628405');
INSERT INTO employees VALUES(70,'Joseph Bandy','CMAC','josephb@cmacroofing.com','+18173015332');
INSERT INTO employees VALUES(71,'Josh Lawrence','CMAC','joshl@cmacroofing.com','580-439-4668');
INSERT INTO employees VALUES(72,'Josh Johnson','CMAC','joshj@cmacroofing.com','512-762-0640');
INSERT INTO employees VALUES(73,'JR Aviles','CMAC','jr@cmacroofing.com',NULL);
INSERT INTO employees VALUES(74,'Juan Mata','CMAC','juanm@cmacroofing.com',NULL);
INSERT INTO employees VALUES(75,'Kambry Russell','CMAC','kambryr@cmacroofing.com','972-849-1524');
INSERT INTO employees VALUES(76,'Kyle Voss','CMAC','kylev@cmacroofing.com','5129058494');
INSERT INTO employees VALUES(77,'Larry Cremean','CMAC','larryc@cmacroofing.com',NULL);
INSERT INTO employees VALUES(78,'Lazaro Castillo','CMAC','lazaroc@cmacroofing.com',NULL);
INSERT INTO employees VALUES(79,'Leo Don','CMAC','leo@cmacroofing.com',NULL);
INSERT INTO employees VALUES(80,'lily Castillo','CMAC','lilyc@cmacroofing.com','972-832-3677');
INSERT INTO employees VALUES(81,'Lucio Medrano','CMAC','luciom@cmacroofing.com','972-921-2253');
INSERT INTO employees VALUES(82,'Luis Gutierrez','CMAC','luisg@cmacroofing.com','+19452466775');
INSERT INTO employees VALUES(83,'Mac Brink','CMAC','macb@cmacroofing.com',NULL);
INSERT INTO employees VALUES(84,'Mario Dixon','CMAC','mariod@cmacroofing.com',NULL);
INSERT INTO employees VALUES(85,'Martin M','CMAC','martinm@cmacroofing.com','+18326907898');
INSERT INTO employees VALUES(86,'Martin L','CMAC','martinl@cmacroofing.com','+14696262412');
INSERT INTO employees VALUES(87,'Marvin Bonilla','CMAC','marvinb@cmacroofing.com','(817) 705-5065');
INSERT INTO employees VALUES(88,'Michael Bennett','CMAC','michaelb@cmacroofing.com','+18178291392');
INSERT INTO employees VALUES(89,'Michael Serenil','CMAC','michaels@cmacroofing.com','817-825-0441');
INSERT INTO employees VALUES(90,'Michael Schumann','CMAC','michaelsc@cmacroofing.com','(817) 964-1421');
INSERT INTO employees VALUES(91,'Miguel Sandia','CMAC','miguels@cmacroofing.com',NULL);
INSERT INTO employees VALUES(92,'Mike Porter','CMAC','mikep@cmacroofing.com',NULL);
INSERT INTO employees VALUES(93,'Mike Holley','CMAC','mikeh@cmacroofing.com','+14693692069');
INSERT INTO employees VALUES(94,'Mike Roque','CMAC','miker@cmacroofing.com','512-808-8193');
INSERT INTO employees VALUES(95,'Mike August','CMAC','mikea@cmacroofing.com','8179075380');
INSERT INTO employees VALUES(96,'Monica Lopez','CMAC','monical@cmacroofing.com',NULL);
INSERT INTO employees VALUES(97,'Nakoa Taggart','CMAC','nakoat@cmacroofing.com','737-710-0445');
INSERT INTO employees VALUES(98,'Omar Guadiana','CMAC','omarg@cmacroofing.com',NULL);
INSERT INTO employees VALUES(99,'Oscar Salazar','CMAC','oscar@cmacroofing.com','512-965-7256');
INSERT INTO employees VALUES(100,'Osiris Hernandez','CMAC','osirish@cmacroofing.com','+19035193830');
INSERT INTO employees VALUES(101,'Pedro Marquez','CMAC','pedrom@cmacroofing.com',NULL);
INSERT INTO employees VALUES(102,'Perla De La Cruz','CMAC','perlad@cmacroofing.com','2149076610');
INSERT INTO employees VALUES(103,'Renee Cremean','CMAC','renee@cmacroofing.com','817-296-3139');
INSERT INTO employees VALUES(104,'Rob Davis','CMAC','rob@cmacroofing.com','+18178884757');
INSERT INTO employees VALUES(105,'Robin Garner','CMAC','robin@cmacroofing.com','+18177974979');
INSERT INTO employees VALUES(106,'Sam Acosta','CMAC','sama@cmacroofing.com','501-514-7366');
INSERT INTO employees VALUES(107,'Sartha vongvivitpatana','CMAC','sartha@cmacroofing.com',NULL);
INSERT INTO employees VALUES(108,'Scott Reichardt','CMAC','scottr@cmacroofing.com','580-483-6781');
INSERT INTO employees VALUES(109,'Sergio Salcido','CMAC','sergios@cmacroofing.com','9729216648');
INSERT INTO employees VALUES(110,'Shane Gresham','CMAC','shane@cmacroofing.com',NULL);
INSERT INTO employees VALUES(111,'Silvano Rojo','CMAC','silvanor@cmacroofing.com',NULL);
INSERT INTO employees VALUES(112,'Simon Luna','CMAC','simonl@cmacroofing.com','512-492-5768');
INSERT INTO employees VALUES(113,'Spencer Fesmire','CMAC','houstonroofer@cmacroofing.com','346-667-7376');
INSERT INTO employees VALUES(114,'Stephanie Smith','CMAC','stephanies@cmacroofing.com',NULL);
INSERT INTO employees VALUES(115,'Stephanie Ramos','CMAC','stephanier@cmacroofing.com',NULL);
INSERT INTO employees VALUES(116,'Steven Ott','CMAC','steveno@cmacroofing.com','5129344806');
INSERT INTO employees VALUES(117,'Tavo at CMAC Roofing','CMAC','tavo@cmacroofing.com',NULL);
INSERT INTO employees VALUES(118,'Valeria Duron','CMAC','valeriad@cmacroofing.com','682-583-7349');
INSERT INTO employees VALUES(119,'Victor at CMAC Roofing','CMAC','victor@cmacroofing.com',NULL);
INSERT INTO employees VALUES(120,'Victor Jr Garcia','CMAC','victorjr@cmacroofing.com',NULL);
INSERT INTO employees VALUES(121,'Vivian Torres','CMAC','vivian@cmacroofing.com','+18177052676');
INSERT INTO employees VALUES(122,'Wes Shierry','CMAC','wes@cmacroofing.com','+1 (817) 501-9807');
INSERT INTO employees VALUES(123,'Yessenia Leiva','CMAC','yessenial@cmacroofing.com','9403903855');
INSERT INTO employees VALUES(128,'Admin','CMAC','admin@cmacroofing.com','');
INSERT INTO employees VALUES(129,'Allison Grussendorf','CMAC','allisong@cmacroofing.com','');
INSERT INTO employees VALUES(130,'Cody Mueller','CMAC','codym@cmacroofing.com','');
INSERT INTO employees VALUES(131,'Daren Shepherd','CMAC','darens@cmacroofing.com','');
INSERT INTO employees VALUES(132,'Garret Denney','CMAC','garretd@cmacroofing.com','');
INSERT INTO employees VALUES(133,'Homer Valencia','CMAC','homerv@cmacroofing.com','');
INSERT INTO employees VALUES(134,'Hunter Autrey','CMAC','huntera@cmacroofing.com','');
INSERT INTO employees VALUES(135,'Jin Lee','CMAC','jinl@cmacroofing.com','');
INSERT INTO employees VALUES(136,'Josh Sprayberry','CMAC','joshs@cmacroofing.com','');
INSERT INTO employees VALUES(137,'Kristen Hester','CMAC','kristenh@cmacroofing.com','');
INSERT INTO employees VALUES(138,'Kristy Transou','CMAC','kristyt@cmacroofing.com','');
INSERT INTO employees VALUES(139,'Michael Hanham','CMAC','michaelh@cmacroofing.com','');
INSERT INTO employees VALUES(140,'Donnie Darko','CMAC','birthdaybuddy@cmacroofing.com','5555555555');
CREATE TABLE roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            category TEXT
        );
INSERT INTO roles VALUES(1,'cmac_bolt_agent','CMAC');
INSERT INTO roles VALUES(2,'cmac_purchasing_agent','CMAC');
INSERT INTO roles VALUES(3,'cmac_account_manager','CMAC');
CREATE TABLE assignments (
            builder_id INTEGER NOT NULL,
            role_id INTEGER NOT NULL,
            employee_id INTEGER NOT NULL,
            source TEXT,
            PRIMARY KEY (builder_id, role_id),
            FOREIGN KEY (builder_id) REFERENCES builders(id) ON DELETE CASCADE,
            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
            FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
        );
INSERT INTO assignments VALUES(1,1,4,'seed:xlsx original');
INSERT INTO assignments VALUES(1,2,1,'seed:xlsx original color');
INSERT INTO assignments VALUES(2,1,4,'seed:xlsx original');
INSERT INTO assignments VALUES(2,2,3,'seed:xlsx original color');
INSERT INTO assignments VALUES(3,1,4,'seed:xlsx original');
INSERT INTO assignments VALUES(3,2,1,'seed:xlsx original color');
INSERT INTO assignments VALUES(4,1,4,'seed:xlsx original');
INSERT INTO assignments VALUES(4,2,1,'seed:xlsx original color');
INSERT INTO assignments VALUES(5,1,4,'seed:xlsx original');
INSERT INTO assignments VALUES(6,1,4,'seed:xlsx original');
INSERT INTO assignments VALUES(6,2,3,'seed:xlsx original color');
INSERT INTO assignments VALUES(7,1,4,'seed:xlsx original');
INSERT INTO assignments VALUES(7,2,3,'seed:xlsx original color');
INSERT INTO assignments VALUES(8,1,4,'seed:xlsx original');
INSERT INTO assignments VALUES(8,2,3,'seed:xlsx original color');
INSERT INTO assignments VALUES(9,1,4,'seed:xlsx original');
INSERT INTO assignments VALUES(9,2,3,'seed:xlsx original color');
INSERT INTO assignments VALUES(10,1,2,'seed:xlsx original');
INSERT INTO assignments VALUES(10,2,3,'seed:xlsx original color');
INSERT INTO assignments VALUES(11,1,2,'seed:xlsx original');
INSERT INTO assignments VALUES(11,2,1,'seed:xlsx original color');
INSERT INTO assignments VALUES(12,1,2,'seed:xlsx original');
INSERT INTO assignments VALUES(12,2,1,'seed:xlsx original color');
INSERT INTO assignments VALUES(13,1,2,'seed:xlsx original');
INSERT INTO assignments VALUES(13,2,1,'seed:xlsx original color');
INSERT INTO assignments VALUES(14,1,2,'seed:xlsx original');
INSERT INTO assignments VALUES(14,2,1,'seed:xlsx original color');
INSERT INTO assignments VALUES(15,1,2,'seed:xlsx original');
INSERT INTO assignments VALUES(15,2,3,'seed:xlsx original color');
INSERT INTO assignments VALUES(16,1,2,'seed:xlsx original');
INSERT INTO assignments VALUES(16,2,3,'seed:xlsx original color');
INSERT INTO assignments VALUES(17,1,2,'seed:xlsx original');
INSERT INTO assignments VALUES(17,2,1,'seed:xlsx original color');
INSERT INTO assignments VALUES(18,1,2,'seed:xlsx original');
INSERT INTO assignments VALUES(18,2,1,'seed:xlsx original color');
INSERT INTO assignments VALUES(19,1,96,'agents.xlsx');
INSERT INTO assignments VALUES(19,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(33,1,96,'agents.xlsx');
INSERT INTO assignments VALUES(33,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(44,1,96,'agents.xlsx');
INSERT INTO assignments VALUES(44,2,3,'agents.xlsx:color');
INSERT INTO assignments VALUES(52,1,96,'agents.xlsx');
INSERT INTO assignments VALUES(52,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(64,1,96,'agents.xlsx');
INSERT INTO assignments VALUES(64,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(74,1,96,'agents.xlsx');
INSERT INTO assignments VALUES(74,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(72,1,96,'agents.xlsx');
INSERT INTO assignments VALUES(72,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(63,1,96,'agents.xlsx');
INSERT INTO assignments VALUES(82,1,96,'agents.xlsx');
INSERT INTO assignments VALUES(23,1,10,'agents.xlsx');
INSERT INTO assignments VALUES(23,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(27,1,10,'agents.xlsx');
INSERT INTO assignments VALUES(27,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(41,1,10,'agents.xlsx');
INSERT INTO assignments VALUES(41,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(46,1,10,'agents.xlsx');
INSERT INTO assignments VALUES(46,2,3,'agents.xlsx:color');
INSERT INTO assignments VALUES(57,1,10,'agents.xlsx');
INSERT INTO assignments VALUES(57,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(59,1,10,'agents.xlsx');
INSERT INTO assignments VALUES(59,2,3,'agents.xlsx:color');
INSERT INTO assignments VALUES(70,1,10,'agents.xlsx');
INSERT INTO assignments VALUES(70,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(73,1,10,'agents.xlsx');
INSERT INTO assignments VALUES(73,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(81,1,10,'agents.xlsx');
INSERT INTO assignments VALUES(81,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(83,1,10,'agents.xlsx');
INSERT INTO assignments VALUES(83,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(20,1,118,'agents.xlsx');
INSERT INTO assignments VALUES(24,1,118,'agents.xlsx');
INSERT INTO assignments VALUES(24,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(29,1,118,'agents.xlsx');
INSERT INTO assignments VALUES(29,2,3,'agents.xlsx:color');
INSERT INTO assignments VALUES(30,1,118,'agents.xlsx');
INSERT INTO assignments VALUES(32,1,118,'agents.xlsx');
INSERT INTO assignments VALUES(32,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(36,1,118,'agents.xlsx');
INSERT INTO assignments VALUES(36,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(38,1,118,'agents.xlsx');
INSERT INTO assignments VALUES(38,2,3,'agents.xlsx:color');
INSERT INTO assignments VALUES(61,1,118,'agents.xlsx');
INSERT INTO assignments VALUES(61,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(60,1,118,'agents.xlsx');
INSERT INTO assignments VALUES(60,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(68,1,118,'agents.xlsx');
INSERT INTO assignments VALUES(68,2,3,'agents.xlsx:color');
INSERT INTO assignments VALUES(85,1,118,'agents.xlsx');
INSERT INTO assignments VALUES(85,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(21,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(22,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(25,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(26,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(28,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(31,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(34,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(35,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(39,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(40,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(40,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(37,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(42,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(43,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(45,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(45,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(47,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(48,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(49,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(49,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(50,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(51,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(53,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(54,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(54,2,1,'agents.xlsx:color');
INSERT INTO assignments VALUES(55,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(55,2,3,'agents.xlsx:color');
INSERT INTO assignments VALUES(56,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(58,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(62,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(65,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(66,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(67,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(69,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(71,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(75,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(76,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(77,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(78,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(79,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(80,1,47,'agents.xlsx');
INSERT INTO assignments VALUES(84,1,47,'agents.xlsx');
CREATE TABLE builder_contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            builder_id INTEGER NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('purchasing_manager','project_manager','accounts_receivable')),
            full_name TEXT,
            email TEXT,
            phone TEXT,
            FOREIGN KEY (builder_id) REFERENCES builders(id) ON DELETE CASCADE
        );
CREATE TABLE communities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            builder_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            city TEXT,
            state TEXT,
            bolt_id INTEGER,
            office TEXT,
            FOREIGN KEY (builder_id) REFERENCES builders(id) ON DELETE CASCADE
        );
INSERT INTO communities VALUES(1,2,'Bayside','Rowlett','Texas',4,'Dallas');
INSERT INTO communities VALUES(2,2,'Prestonwood','Carrollton','Texas',4,'Dallas');
INSERT INTO communities VALUES(3,2,'Plano Gateway','Plano','Texas',4,'Dallas');
INSERT INTO communities VALUES(4,2,'Woodcreek','Fate','Texas',4,'Dallas');
INSERT INTO communities VALUES(5,2,'Stark Farms','Denton','Texas',4,'Dallas');
INSERT INTO communities VALUES(6,2,'Whitewing Trails','Princeton','Texas',4,'Dallas');
INSERT INTO communities VALUES(7,2,'Verandah 50s','Royse City','Texas',4,'Dallas');
INSERT INTO communities VALUES(8,2,'Hometown TH 22','North Richland Hills','Texas',4,'Dallas');
INSERT INTO communities VALUES(9,2,'Hurricane Creek - 50s','Anna','Texas',4,'Dallas');
INSERT INTO communities VALUES(10,2,'Hurricane Creek - 70s','Anna','Texas',4,'Dallas');
INSERT INTO communities VALUES(11,2,'Whitewing Trails 60','Princeton','Texas',4,'Dallas');
INSERT INTO communities VALUES(12,2,'Whitewing Trails 50','Princeton','Texas',4,'Dallas');
INSERT INTO communities VALUES(13,2,'Pine','McKinney','Texas',4,'Dallas');
INSERT INTO communities VALUES(14,2,'Brookville Estates','Forney','Texas',4,'Dallas');
INSERT INTO communities VALUES(15,2,'Lovers Landing','Forney','Texas',4,'Dallas');
INSERT INTO communities VALUES(16,2,'Wildflower Ranch (Tradition)','Fort Worth','Texas',4,'Dallas');
INSERT INTO communities VALUES(17,2,'Chalk Hill','Celina','Texas',4,'Dallas');
INSERT INTO communities VALUES(18,2,'Treeline','Farmers Branch','Texas',4,'Dallas');
INSERT INTO communities VALUES(19,2,'TreeLine','Justin','Texas',4,'Dallas');
INSERT INTO communities VALUES(20,2,'Lake Pointe at Paloma Creek','Little Elm','Texas',4,'Dallas');
INSERT INTO communities VALUES(21,2,'Prairie Ridge 6','Goodland','Texas',4,'Dallas');
INSERT INTO communities VALUES(22,2,'Prairie Ridge - HB','Venus','Texas',4,'Dallas');
INSERT INTO communities VALUES(23,2,'Prairie Ridge 6','Midlothian','Texas',4,'Dallas');
INSERT INTO communities VALUES(24,2,'prueba','Woodlands','Texas',4,'Dallas');
INSERT INTO communities VALUES(25,2,'Plano Gateway - Townhomes','Plano','Texas',4,'Dallas');
INSERT INTO communities VALUES(26,2,'Verandah 60s','Royse City','Texas',4,'Dallas');
INSERT INTO communities VALUES(27,2,'Arbors at Lakewood Village','Lakewood Village','Texas',4,'Dallas');
INSERT INTO communities VALUES(28,2,'Heath club and yacht club','Heath','Texas',4,'Dallas');
INSERT INTO communities VALUES(29,2,'Watercolor Single Family','Euless','Texas',4,'Dallas');
INSERT INTO communities VALUES(30,26,'Hunters Ridge','Gunter','Texas',47,'Dallas');
INSERT INTO communities VALUES(31,3,'Gladiator Estates','Italy','Texas',4,'Dallas');
INSERT INTO communities VALUES(32,27,'Manhattan Village','Forney','Texas',10,'Dallas');
INSERT INTO communities VALUES(33,27,'Hampton Villas','Crowley','Texas',10,'Dallas');
INSERT INTO communities VALUES(34,27,'Harrison Park','Melissa','Texas',10,'Dallas');
INSERT INTO communities VALUES(35,27,'Jeans Creek','McKinney','Texas',10,'Dallas');
INSERT INTO communities VALUES(36,27,'Magnolia Townhomes 10010','Burleson','Texas',10,'Dallas');
INSERT INTO communities VALUES(37,27,'Arden Park','Anna','Texas',10,'Dallas');
INSERT INTO communities VALUES(38,27,'Denison','Denison','Texas',10,'Dallas');
INSERT INTO communities VALUES(39,27,'Royal Court (King Witt Paradise, LLC)','Frisco','Texas',10,'Dallas');
INSERT INTO communities VALUES(40,10,'Letara Ranch','Haslet','Texas',2,'Dallas');
INSERT INTO communities VALUES(41,10,'Bluebonnet Trails','Arlington','Texas',2,'Dallas');
INSERT INTO communities VALUES(42,10,'Tavolo Park','Fort Worth','Texas',2,'Dallas');
INSERT INTO communities VALUES(43,10,'Aria','Sachse','Texas',2,'Dallas');
INSERT INTO communities VALUES(44,10,'Woodstone','Providence Village','Texas',2,'Dallas');
INSERT INTO communities VALUES(45,10,'Tavolo Park','Dickinson','Texas',2,'Dallas');
INSERT INTO communities VALUES(46,10,'Mitchell Farms 65''s','Mansfield','Texas',2,'Dallas');
INSERT INTO communities VALUES(47,10,'Sunset Crossing','Mansfield','Texas',2,'Dallas');
INSERT INTO communities VALUES(48,10,'Solterra','Mesquite','Texas',2,'Dallas');
INSERT INTO communities VALUES(49,10,'Collin Creek','Plano','Texas',2,'Dallas');
INSERT INTO communities VALUES(50,10,'Thompson Farms','Van Alstyne','Texas',2,'Dallas');
INSERT INTO communities VALUES(51,10,'Heritage Park','Garland','Texas',2,'Dallas');
INSERT INTO communities VALUES(52,10,'Pebblebrook','Sherman','Texas',2,'Dallas');
INSERT INTO communities VALUES(53,10,'Ridge Crossing','Waxahachie','Texas',2,'Dallas');
INSERT INTO communities VALUES(54,10,'Rio Vista 101209600000','Aledo','Texas',2,'Dallas');
INSERT INTO communities VALUES(55,10,'Bel Air Village 101214400000','Sherman','Texas',2,'Dallas');
INSERT INTO communities VALUES(56,10,'Green Meadows','Celina','Texas',2,'Dallas');
INSERT INTO communities VALUES(57,10,'Bel Air Village','Sherman','Texas',2,'Dallas');
INSERT INTO communities VALUES(58,10,'Westridge 40s','Princeton','Texas',2,'Dallas');
INSERT INTO communities VALUES(59,10,'Westridge 50s','Princeton','Texas',2,'Dallas');
INSERT INTO communities VALUES(60,28,'1100 Raven Bend Ct -Kearney','Southlake','Texas',47,'Dallas');
INSERT INTO communities VALUES(61,4,'Karis','Crowley','Texas',4,'Dallas');
INSERT INTO communities VALUES(62,4,'Cadence Homes Linkside','Irving','Texas',4,'Dallas');
INSERT INTO communities VALUES(63,4,'Solterra','Mesquite','Texas',4,'Dallas');
INSERT INTO communities VALUES(64,4,'Cadence Homes - Mosaic','Prosper','Texas',4,'Dallas');
INSERT INTO communities VALUES(65,4,'Cadence Homes Karis','Crowley','Texas',4,'Dallas');
INSERT INTO communities VALUES(66,4,'Cadence Homes Talia','Mesquite','Texas',4,'Dallas');
INSERT INTO communities VALUES(67,4,'Cadence Homes - Solterra','Mesquite','Texas',4,'Dallas');
INSERT INTO communities VALUES(68,29,'Meadow Ridge','Red Oak','Texas',118,'Dallas');
INSERT INTO communities VALUES(69,29,'Meadow Ridge Townhomes','Red Oak','Texas',118,'Dallas');
INSERT INTO communities VALUES(70,29,'U/K','Mansfield','Texas',118,'Dallas');
INSERT INTO communities VALUES(71,29,'Mabank Meadows','Mabank','Texas',118,'Dallas');
INSERT INTO communities VALUES(72,29,'CREEKBEND ADDITION PH 2','Red Oak','Texas',118,'Dallas');
INSERT INTO communities VALUES(73,29,'Camden Park Estates PH 5','Waxahachie','Texas',118,'Dallas');
INSERT INTO communities VALUES(74,29,'Camden Park Ph 4','Farmersville','Texas',118,'Dallas');
INSERT INTO communities VALUES(75,30,'Park Brook','Springtown','Texas',118,'Dallas');
INSERT INTO communities VALUES(77,30,'Inheritance Estates','Springtown','Texas',118,'Dallas');
INSERT INTO communities VALUES(79,30,'Boardwalk Estates','Springtown','Texas',118,'Dallas');
INSERT INTO communities VALUES(81,31,'Marsh Residence','Argyle','Texas',47,'Dallas');
INSERT INTO communities VALUES(84,31,'50 Hidden Valley Ln.-TTR','Shady Shores','Texas',47,'Dallas');
INSERT INTO communities VALUES(85,32,'Hollyhock','Frisco','Texas',118,'Dallas');
INSERT INTO communities VALUES(86,32,'The Parks at Legacy','Prosper','Texas',118,'Dallas');
INSERT INTO communities VALUES(87,32,'Merion at Midtown Park','Dallas','Texas',118,'Dallas');
INSERT INTO communities VALUES(89,32,'Van Buren Estates','Weston','Texas',118,'Dallas');
INSERT INTO communities VALUES(90,32,'Bel Air Village','Sherman','Texas',118,'Dallas');
INSERT INTO communities VALUES(91,32,'The Oaks of North Grove','Waxahachie','Texas',118,'Dallas');
INSERT INTO communities VALUES(92,32,'Canyon Falls','Argyle','Texas',118,'Dallas');
INSERT INTO communities VALUES(93,32,'Karis','Crowley','Texas',118,'Dallas');
INSERT INTO communities VALUES(94,32,'Silo Mills','Burleson','Texas',118,'Dallas');
INSERT INTO communities VALUES(95,32,'Silo Mills','Joshua','Texas',118,'Dallas');
INSERT INTO communities VALUES(96,32,'Avondale','Fate','Texas',118,'Dallas');
INSERT INTO communities VALUES(97,32,'Summer Crest','Fort Worth','Texas',118,'Dallas');
INSERT INTO communities VALUES(98,32,'The Vines','Haslet','Texas',118,'Dallas');
INSERT INTO communities VALUES(99,32,'Grand Heritage','Lavon','Texas',118,'Dallas');
INSERT INTO communities VALUES(100,32,'Canyon Falls 90s','Argyle','Texas',118,'Dallas');
INSERT INTO communities VALUES(101,32,'Canyon Falls 70s','Flower Mound','Texas',118,'Dallas');
INSERT INTO communities VALUES(102,32,'Lakeview Heights 100s/160s','Azle','Texas',118,'Dallas');
INSERT INTO communities VALUES(103,32,'Lakeview Heighs 100s/160s','Azle','Texas',118,'Dallas');
INSERT INTO communities VALUES(104,32,'Talia 50s','Forney','Texas',118,'Dallas');
INSERT INTO communities VALUES(106,32,'The Grove','Frisco','Texas',118,'Dallas');
INSERT INTO communities VALUES(107,32,'Trinity Falls 60s','McKinney','Texas',118,'Dallas');
INSERT INTO communities VALUES(108,33,'City Park Place','McKinney','Texas',96,'Dallas');
INSERT INTO communities VALUES(111,39,'4001 Estancia Way - Dallas','Fort Worth','Texas',47,'Dallas');
INSERT INTO communities VALUES(113,37,'2 Julian Ln- DHS Homes','Van Alstyne','Texas',47,'Dallas');
INSERT INTO communities VALUES(114,37,'Unknow Prosper-TTR','Prosper','Texas',47,'Dallas');
INSERT INTO communities VALUES(117,37,'1289 Hunt Rd-TTR','Gunter','Texas',47,'Dallas');
INSERT INTO communities VALUES(118,37,'415 S Oak St-TTR','Ector','Texas',47,'Dallas');
INSERT INTO communities VALUES(120,37,'6460 County Road 703 -TTR','Farmersville','Texas',47,'Dallas');
INSERT INTO communities VALUES(121,37,'4282 S Crest Haven Rd.-TTR','Dallas','Texas',47,'Dallas');
INSERT INTO communities VALUES(122,37,'361 Derby Dr.-TTR','Van Alstyne','Texas',47,'Dallas');
INSERT INTO communities VALUES(123,41,'Pebblebrook','Sherman','Texas',10,'Dallas');
INSERT INTO communities VALUES(124,41,'ATX-Hanolley Hills','Sherman','Texas',10,'Dallas');
INSERT INTO communities VALUES(127,43,'Custom','Dallas','Texas',47,'Dallas');
INSERT INTO communities VALUES(128,43,'Alameda Heights','Dallas','Texas',47,'Dallas');
INSERT INTO communities VALUES(129,43,'Chesterfield Heights','Dallas','Texas',47,'Dallas');
INSERT INTO communities VALUES(130,43,'Peak Suburban','Dallas','Texas',47,'Dallas');
INSERT INTO communities VALUES(131,43,'La Spring','Dallas','Texas',47,'Dallas');
INSERT INTO communities VALUES(133,43,'Carver Heights Addition','Dallas','Texas',47,'Dallas');
INSERT INTO communities VALUES(134,43,'Unknow Dallas','Dallas','Texas',47,'Dallas');
INSERT INTO communities VALUES(135,43,'1817 Cooper St.-TTR','Dallas','Texas',47,'Dallas');
INSERT INTO communities VALUES(136,43,'6803 Casa Loma Ave. -TTR','Dallas','Texas',47,'Dallas');
INSERT INTO communities VALUES(137,44,'Letara Ranch','Haslet','Texas',96,'Dallas');
INSERT INTO communities VALUES(138,44,'Tanners mills','Prosper','Texas',96,'Dallas');
INSERT INTO communities VALUES(139,44,'Collinsbrook Farm','Frisco','Texas',96,'Dallas');
INSERT INTO communities VALUES(140,44,'Herons bay','Garland','Texas',96,'Dallas');
INSERT INTO communities VALUES(141,44,'Falls of prosper','Prosper','Texas',96,'Dallas');
INSERT INTO communities VALUES(142,44,'Enclave/Villages at Creekwood','Frisco','Texas',96,'Dallas');
INSERT INTO communities VALUES(143,44,'Spring View Estates','Frisco','Texas',96,'Dallas');
INSERT INTO communities VALUES(144,44,'Wellspring Estates','Celina','Texas',96,'Dallas');
INSERT INTO communities VALUES(145,44,'Villages of Hurricane Creek','Anna','Texas',96,'Dallas');
INSERT INTO communities VALUES(147,44,'Northlake Estates','Little Elm','Texas',96,'Dallas');
INSERT INTO communities VALUES(148,44,'Liberty Meadows 1','Weatherford','Texas',96,'Dallas');
INSERT INTO communities VALUES(150,44,'Cambridge','Prosper','Texas',96,'Dallas');
INSERT INTO communities VALUES(151,44,'Birdsong','Mansfield','Texas',96,'Dallas');
INSERT INTO communities VALUES(152,44,'Edgewood Creek','Celina','Texas',96,'Dallas');
INSERT INTO communities VALUES(155,44,'Valencia on the Lake','Little Elm','Texas',96,'Dallas');
INSERT INTO communities VALUES(157,44,'Spiritas Ranch','Little Elm','Texas',96,'Dallas');
INSERT INTO communities VALUES(158,44,'Trails of cottonwood','Rowlett','Texas',96,'Dallas');
INSERT INTO communities VALUES(159,44,'Trophy','Trophy Club','Texas',96,'Dallas');
INSERT INTO communities VALUES(160,44,'Hurricane Creek','Anna','Texas',96,'Dallas');
INSERT INTO communities VALUES(161,44,'LeTara','Haslet','Texas',96,'Dallas');
INSERT INTO communities VALUES(162,44,'San Jacinto','McKinney','Texas',96,'Dallas');
INSERT INTO communities VALUES(163,44,'Trails of Cottonwood Creek','Rowlett','Texas',96,'Dallas');
INSERT INTO communities VALUES(164,44,'Brookfield','Melissa','Texas',96,'Dallas');
INSERT INTO communities VALUES(165,44,'Villages of Creekwood','Frisco','Texas',96,'Dallas');
INSERT INTO communities VALUES(166,44,'unkown (Builders Home)','Aubrey','Texas',96,'Dallas');
INSERT INTO communities VALUES(167,44,'Hurrican Creek','Anna','Texas',96,'Dallas');
INSERT INTO communities VALUES(169,44,'Homeowner','Burleson','Texas',96,'Dallas');
INSERT INTO communities VALUES(170,12,'Eden Estates','North Richland Hills','Texas',2,'Dallas');
INSERT INTO communities VALUES(172,12,'Preston Manor','Colleyville','Texas',2,'Dallas');
INSERT INTO communities VALUES(173,12,'Talon Hills','Fort Worth','Texas',2,'Dallas');
INSERT INTO communities VALUES(174,12,'Rumfield Estates','North Richland Hills','Texas',2,'Dallas');
INSERT INTO communities VALUES(175,12,'Waterfall Ranch','Waxahachie','Texas',2,'Dallas');
INSERT INTO communities VALUES(176,12,'St. Joseph''s Estates','North Richland Hills','Texas',2,'Dallas');
INSERT INTO communities VALUES(177,12,'The Grove','North Richland Hills','Texas',2,'Dallas');
INSERT INTO communities VALUES(178,12,'Custom','North Richland Hills','Texas',2,'Dallas');
INSERT INTO communities VALUES(180,13,'Vintage Place','McKinney','Texas',2,'Dallas');
INSERT INTO communities VALUES(181,13,'Justin Crossing','Justin','Texas',2,'Dallas');
INSERT INTO communities VALUES(182,13,'Silverleaf','Frisco','Texas',2,'Dallas');
INSERT INTO communities VALUES(183,13,'Lake Shore Village 50s','Rowlett','Texas',2,'Dallas');
INSERT INTO communities VALUES(184,13,'Lake Forest 40s','McKinney','Texas',2,'Dallas');
INSERT INTO communities VALUES(185,13,'Wellspring Estates 70s','Celina','Texas',2,'Dallas');
INSERT INTO communities VALUES(186,13,'Wellspring Estates 60s','Celina','Texas',2,'Dallas');
INSERT INTO communities VALUES(187,13,'Lake Forest 50s','McKinney','Texas',2,'Dallas');
INSERT INTO communities VALUES(188,13,'Lake Forest 60s','McKinney','Texas',2,'Dallas');
INSERT INTO communities VALUES(189,13,'Whitestone Estates','Parker','Texas',2,'Dallas');
INSERT INTO communities VALUES(190,13,'Lake Shore Village 60s','Rowlett','Texas',2,'Dallas');
INSERT INTO communities VALUES(191,13,'Kings Crossing','Parker','Texas',2,'Dallas');
INSERT INTO communities VALUES(194,13,'Wellspring Estates 100s','Celina','Texas',2,'Dallas');
INSERT INTO communities VALUES(195,13,'Cottonwood Creek 50s','Rowlett','Texas',2,'Dallas');
INSERT INTO communities VALUES(197,53,'Rowlett - Landon Homes','Rowlett','Texas',47,'Dallas');
INSERT INTO communities VALUES(198,53,'brookside','Frisco','Texas',47,'Dallas');
INSERT INTO communities VALUES(199,53,'Brookisde North','Frisco','Texas',47,'Dallas');
INSERT INTO communities VALUES(200,53,'Brookside North - 50s','Frisco','Texas',47,'Dallas');
INSERT INTO communities VALUES(201,54,'DFW - Luella Cr Cottage - 1567784','Sherman','Texas',47,'Dallas');
INSERT INTO communities VALUES(202,54,'DFW - Luella Cr Cottage  - 1567784','Sherman','Texas',47,'Dallas');
INSERT INTO communities VALUES(203,54,'DFW - Creekview Cottage - 2914284','Pilot Point','Texas',47,'Dallas');
INSERT INTO communities VALUES(204,54,'DFW - Shale Creek Watermill - 1569889','Justin','Texas',47,'Dallas');
INSERT INTO communities VALUES(205,54,'Hurricane Creek South Classic','Anna','Texas',47,'Dallas');
INSERT INTO communities VALUES(206,54,'Hidden Meadows','Sherman','Texas',47,'Dallas');
INSERT INTO communities VALUES(207,54,'Solterra Brookstone','Mesquite','Texas',47,'Dallas');
INSERT INTO communities VALUES(208,54,'DFW - Hidden Meadows Watermill - 1567689','Sherman','Texas',47,'Dallas');
INSERT INTO communities VALUES(209,54,'Hurricane Creek Classic - 1563185','Anna','Texas',47,'Dallas');
INSERT INTO communities VALUES(210,54,'Hurricane Creek South Cottage','Anna','Texas',47,'Dallas');
INSERT INTO communities VALUES(211,54,'Soltera Lonestar','Mesquite','Texas',47,'Dallas');
INSERT INTO communities VALUES(212,54,'DFW - Addison Hills Classic - 1565885','Cedar Hill','Texas',47,'Dallas');
INSERT INTO communities VALUES(213,54,'DFW - Solterra Classic - 1466285','Mesquite','Texas',47,'Dallas');
INSERT INTO communities VALUES(214,54,'DFW - Solterra Lonestar PH 2 - 146635','Mesquite','Texas',47,'Dallas');
INSERT INTO communities VALUES(215,54,'Rosemary Ridge','Fort Worth','Texas',47,'Dallas');
INSERT INTO communities VALUES(216,54,'Shaded Tree Lakeside','McKinney','Texas',47,'Dallas');
INSERT INTO communities VALUES(217,54,'DFW - Prairie View Cottage - 1562784','Ennis','Texas',47,'Dallas');
INSERT INTO communities VALUES(218,54,'DFW - Shale Creek Watermill Ph 3A','Rhome','Texas',47,'Dallas');
INSERT INTO communities VALUES(219,54,'Shale Creek Cottage','Justin','Texas',47,'Dallas');
INSERT INTO communities VALUES(220,54,'Prairie View Watermill','Ennis','Texas',47,'Dallas');
INSERT INTO communities VALUES(221,54,'Shaded Tree Classic','McKinney','Texas',47,'Dallas');
INSERT INTO communities VALUES(222,54,'Shaded Tree Brookstone','McKinney','Texas',47,'Dallas');
INSERT INTO communities VALUES(223,54,'DFW - Prairie VW Classic','Ennis','Texas',47,'Dallas');
INSERT INTO communities VALUES(224,54,'DFW - McKenzie Tr Cottage','Balch Springs','Texas',47,'Dallas');
INSERT INTO communities VALUES(225,54,'DFW-McKenzie Tr Watermill','Balch Springs','Texas',47,'Dallas');
INSERT INTO communities VALUES(226,52,'Oak ridge','Fort Worth','Texas',96,'Dallas');
INSERT INTO communities VALUES(227,52,'Chisholm homes','Newark','Texas',96,'Dallas');
INSERT INTO communities VALUES(228,52,'Big Sky Estates','Ponder','Texas',96,'Dallas');
INSERT INTO communities VALUES(229,52,'Beall Way','Denton','Texas',96,'Dallas');
INSERT INTO communities VALUES(230,52,'Willow wood','Sanger','Texas',96,'Dallas');
INSERT INTO communities VALUES(231,52,'South Park Meadows','Princeton','Texas',96,'Dallas');
INSERT INTO communities VALUES(232,52,'Logan Square','Fort Worth','Texas',96,'Dallas');
INSERT INTO communities VALUES(233,52,'Patriot Estates','Venus','Texas',96,'Dallas');
INSERT INTO communities VALUES(234,52,'VistaWest.','Fort Worth','Texas',96,'Dallas');
INSERT INTO communities VALUES(235,52,'Princeton Heights','Princeton','Texas',96,'Dallas');
INSERT INTO communities VALUES(237,52,'Vista West','Fort Worth','Texas',96,'Dallas');
INSERT INTO communities VALUES(238,52,'The Woodlands','Krugerville','Texas',96,'Dallas');
INSERT INTO communities VALUES(239,52,'Cody Faught (personal)','Azle','Texas',96,'Dallas');
INSERT INTO communities VALUES(244,52,'Cresson Estates. Cresson, Tx.','Cresson','Texas',96,'Dallas');
INSERT INTO communities VALUES(245,52,'Re-roof','Grapevine','Texas',96,'Dallas');
INSERT INTO communities VALUES(247,52,'Treaty Oak','Granbury','Texas',96,'Dallas');
INSERT INTO communities VALUES(248,55,'Miraverde South Ph 2','Crowley','Texas',47,'Dallas');
INSERT INTO communities VALUES(249,55,'Vista Point','Grandview','Texas',47,'Dallas');
INSERT INTO communities VALUES(250,55,'Polo Ridge','Mesquite','Texas',47,'Dallas');
INSERT INTO communities VALUES(251,55,'The Preserve','Sherman','Texas',47,'Dallas');
INSERT INTO communities VALUES(252,55,'Brahman Ranch','Venus','Texas',47,'Dallas');
INSERT INTO communities VALUES(254,55,'Woodstone','Ferris','Texas',47,'Dallas');
INSERT INTO communities VALUES(255,55,'Bison Meadow','Waxahachie','Texas',47,'Dallas');
INSERT INTO communities VALUES(256,55,'Ten Mile Creek','DeSoto','Texas',47,'Dallas');
INSERT INTO communities VALUES(257,55,'Coppenger Place','Godley','Texas',47,'Dallas');
INSERT INTO communities VALUES(258,55,'Hadley Farms','Godley','Texas',47,'Dallas');
INSERT INTO communities VALUES(260,55,'The Arbors','Midlothian','Texas',47,'Dallas');
INSERT INTO communities VALUES(262,55,'Spring Side Esates','Waxahachie','Texas',47,'Dallas');
INSERT INTO communities VALUES(263,55,'Mercer meadows','Royse City','Texas',2,'Dallas');
INSERT INTO communities VALUES(264,55,'Westside Preserve','Midlothian','Texas',47,'Dallas');
INSERT INTO communities VALUES(265,55,'Hickory Hill','Sherman','Texas',47,'Dallas');
INSERT INTO communities VALUES(266,5,'Sutton Fields','Celina','Texas',4,'Dallas');
INSERT INTO communities VALUES(269,5,'Copper Creek','Fort Worth','Texas',4,'Dallas');
INSERT INTO communities VALUES(270,5,'Woodmere','Denton','Texas',4,'Dallas');
INSERT INTO communities VALUES(271,5,'Riverset','Garland','Texas',4,'Dallas');
INSERT INTO communities VALUES(272,5,'Hunters Ridge','Crowley','Texas',4,'Dallas');
INSERT INTO communities VALUES(274,5,'Mobberly Farms','Pilot Point','Texas',4,'Dallas');
INSERT INTO communities VALUES(275,5,'Woodstone','Providence Village','Texas',4,'Dallas');
INSERT INTO communities VALUES(276,5,'Ashford Park','Corinth','Texas',12,'Dallas');
INSERT INTO communities VALUES(278,5,'Place Keller','Keller','Texas',4,'Dallas');
INSERT INTO communities VALUES(285,56,'Mark Cooper Residence','Valley View','Texas',47,'Dallas');
INSERT INTO communities VALUES(286,57,'Dove Creek','Frisco','Texas',10,'Dallas');
INSERT INTO communities VALUES(287,57,'Windhaven','Lewisville','Texas',10,'Dallas');
INSERT INTO communities VALUES(288,57,'Wade Settlement Townhomes','Frisco','Texas',10,'Dallas');
INSERT INTO communities VALUES(290,57,'City Point','North Richland Hills','Texas',10,'Dallas');
INSERT INTO communities VALUES(291,57,'Iron Horse Urban Row Homes','Mesquite','Texas',10,'Dallas');
INSERT INTO communities VALUES(292,57,'Tenison Village D30s','Dallas','Texas',10,'Dallas');
INSERT INTO communities VALUES(293,57,'Valencia on the Lake D60','Little Elm','Texas',10,'Dallas');
INSERT INTO communities VALUES(294,57,'Bayside','Rowlett','Texas',10,'Dallas');
INSERT INTO communities VALUES(295,57,'Lakeshore Terrace','Flower Mound','Texas',10,'Dallas');
INSERT INTO communities VALUES(296,57,'Homeowner','Richardson','Texas',10,'Dallas');
INSERT INTO communities VALUES(298,57,'Hurricane Creek 40','Anna','Texas',10,'Dallas');
INSERT INTO communities VALUES(299,57,'Reroof','Plano','Texas',10,'Dallas');
INSERT INTO communities VALUES(300,57,'Crowley 50''','Crowley','Texas',10,'Dallas');
INSERT INTO communities VALUES(301,57,'Crowley 60''','Crowley','Texas',10,'Dallas');
INSERT INTO communities VALUES(302,57,'Sutton Fields D50s','Aubrey','Texas',10,'Dallas');
INSERT INTO communities VALUES(303,57,'Sutton Fields D40s','Aubrey','Texas',10,'Dallas');
INSERT INTO communities VALUES(304,57,'Collin Creek','Plano','Texas',10,'Dallas');
INSERT INTO communities VALUES(305,57,'Spiritas 50''','Little Elm','Texas',10,'Dallas');
INSERT INTO communities VALUES(306,57,'City Point D30s','North Richland Hills','Texas',10,'Dallas');
INSERT INTO communities VALUES(307,57,'Bayside D50s','Rowlett','Texas',10,'Dallas');
INSERT INTO communities VALUES(308,57,'Bayside D30s','Rowlett','Texas',10,'Dallas');
INSERT INTO communities VALUES(309,57,'Spiritas 40''','Little Elm','Texas',10,'Dallas');
INSERT INTO communities VALUES(310,57,'Collin Creek T22s','Plano','Texas',10,'Dallas');
INSERT INTO communities VALUES(311,57,'Walden Pond','Forney','Texas',10,'Dallas');
INSERT INTO communities VALUES(312,57,'Hurricane Creek Ln','Anna','Texas',10,'Dallas');
INSERT INTO communities VALUES(313,57,'Hurricane Creek 70','Anna','Texas',10,'Dallas');
INSERT INTO communities VALUES(314,57,'Creekwood 55s','Frisco','Texas',79,'Dallas');
INSERT INTO communities VALUES(315,57,'Legacy Hills 50s','Celina','Texas',79,'Dallas');
INSERT INTO communities VALUES(316,57,'Hurricane Creek D60','Anna','Texas',70,'Dallas');
INSERT INTO communities VALUES(317,57,'Creekwood 65s','Frisco','Texas',79,'Dallas');
INSERT INTO communities VALUES(318,57,'Windhaven TH s','Lewisville','Texas',79,'Dallas');
INSERT INTO communities VALUES(319,57,'Wildflower Ranch 50 55','Justin','Texas',10,'Dallas');
INSERT INTO communities VALUES(320,57,'Iron Horse Village','Mesquite','Texas',10,'Dallas');
INSERT INTO communities VALUES(321,15,'Kings Ridge','Denton','Texas',2,'Dallas');
INSERT INTO communities VALUES(322,15,'Eastridge','Princeton','Texas',2,'Dallas');
INSERT INTO communities VALUES(323,15,'Eastridge - 50 - LN  61129120000','McKinney','Texas',2,'Dallas');
INSERT INTO communities VALUES(324,15,'Bryant Farms','Melissa','Texas',2,'Dallas');
INSERT INTO communities VALUES(325,15,'Trails of Lavon 40','Lavon','Texas',2,'Dallas');
INSERT INTO communities VALUES(326,15,'Trails of Lavon - 50 & 60','Lavon','Texas',2,'Dallas');
INSERT INTO communities VALUES(327,15,'Lakehaven','Farmersville','Texas',2,'Dallas');
INSERT INTO communities VALUES(328,15,'Estridge *Reroof*','McKinney','Texas',2,'Dallas');
INSERT INTO communities VALUES(329,15,'Eastridge - 50 - LN','McKinney','Texas',2,'Dallas');
INSERT INTO communities VALUES(330,15,'River Ridge 50','Crandall','Texas',2,'Dallas');
INSERT INTO communities VALUES(331,15,'River Ridge - 50','Crandall','Texas',2,'Dallas');
INSERT INTO communities VALUES(332,15,'Eastridge *Reroof','Princeton','Texas',2,'Dallas');
INSERT INTO communities VALUES(333,15,'Westmoor','Sherman','Texas',2,'Dallas');
INSERT INTO communities VALUES(334,15,'Westmoor - 50','Sherman','Texas',2,'Dallas');
INSERT INTO communities VALUES(336,58,'Lake Kiowa','Gainsville','Texas',47,'Dallas');
INSERT INTO communities VALUES(337,59,'River Oaks at Sawmill Road','Chandler','Texas',10,'Dallas');
INSERT INTO communities VALUES(338,59,'Treaty Oak','Granbury','Texas',10,'Dallas');
INSERT INTO communities VALUES(339,59,'Tolar Oaks','Tolar','Texas',10,'Dallas');
INSERT INTO communities VALUES(340,59,'The Villages of Mayfield','Cleburne','Texas',10,'Dallas');
INSERT INTO communities VALUES(341,59,'Waterside at Cedar Creek','Abilene','Texas',10,'Dallas');
INSERT INTO communities VALUES(342,59,'Highland Forest - Gilmer','Gilmer','Texas',10,'Dallas');
INSERT INTO communities VALUES(343,59,'Pitcock Addition','Graham','Texas',10,'Dallas');
INSERT INTO communities VALUES(344,59,'Colony Park','Eastland','Texas',10,'Dallas');
INSERT INTO communities VALUES(345,59,'Meadows Addition','Chandler','Texas',10,'Dallas');
INSERT INTO communities VALUES(346,59,'Expressway Village','Wichita Falls','Texas',10,'Dallas');
INSERT INTO communities VALUES(347,59,'Callahan Bayou','Clyde','Texas',10,'Dallas');
INSERT INTO communities VALUES(348,59,'Heather Heights','Itasca','Texas',10,'Dallas');
INSERT INTO communities VALUES(349,59,'Courtland Place','Cleburne','Texas',10,'Dallas');
INSERT INTO communities VALUES(350,59,'South Hampton Addition','Brownwood','Texas',10,'Dallas');
INSERT INTO communities VALUES(351,59,'Duckhorn Towne','Brownwood','Texas',10,'Dallas');
INSERT INTO communities VALUES(353,59,'Park Central','Mineola','Texas',10,'Dallas');
INSERT INTO communities VALUES(354,59,'Victory Estates','Mabank','Texas',10,'Dallas');
INSERT INTO communities VALUES(360,6,'Brookside','Frisco','Texas',4,'Dallas');
INSERT INTO communities VALUES(361,6,'Olivia Clarke Homes','Plano','Texas',4,'Dallas');
INSERT INTO communities VALUES(362,6,'Brookside','Plano','Texas',4,'Dallas');
INSERT INTO communities VALUES(364,6,'College Street','McKinney','Texas',4,'Dallas');
INSERT INTO communities VALUES(365,6,'Celina Hills','Celina','Texas',4,'Dallas');
INSERT INTO communities VALUES(366,6,'Wylie','Wylie','Texas',4,'Dallas');
INSERT INTO communities VALUES(367,6,'Wyliee','Wylie','Texas',4,'Dallas');
INSERT INTO communities VALUES(368,6,'W','Wylie','Texas',4,'Dallas');
INSERT INTO communities VALUES(369,6,'North Square at Uptown','Celina','Texas',4,'Dallas');
INSERT INTO communities VALUES(370,6,'Cottage Hill','Celina','Texas',4,'Dallas');
INSERT INTO communities VALUES(371,6,'Harper Estates','Celina','Texas',4,'Dallas');
INSERT INTO communities VALUES(372,6,'Chatham Reserve','Providence Village','Texas',4,'Dallas');
INSERT INTO communities VALUES(373,6,'The Heights at Uptown','Celina','Texas',4,'Dallas');
INSERT INTO communities VALUES(375,6,'Arbors at Lakewood Village','Lakewood Village','Texas',4,'Dallas');
INSERT INTO communities VALUES(376,16,'Runaway Bay','Runaway Bay','Texas',2,'Dallas');
INSERT INTO communities VALUES(377,16,'Lakes of River Trails','Fort Worth','Texas',2,'Dallas');
INSERT INTO communities VALUES(378,16,'NorthGlen','Haslet','Texas',2,'Dallas');
INSERT INTO communities VALUES(379,16,'Highland Oaks','Boyd','Texas',2,'Dallas');
INSERT INTO communities VALUES(381,63,'Valencia Estates','Irving','Texas',96,'Dallas');
INSERT INTO communities VALUES(384,63,'4403 Somerville Ave -TTR','Dallas','Texas',96,'Dallas');
INSERT INTO communities VALUES(386,63,'9705 Karin Ct -TTR','Argyle','Texas',96,'Dallas');
INSERT INTO communities VALUES(387,63,'9431 Vista Circle -TTR','Irving','Texas',96,'Dallas');
INSERT INTO communities VALUES(388,64,'The Lakes Of Somercrest 60''s','Midlothian','Texas',96,'Dallas');
INSERT INTO communities VALUES(389,64,'Watercress 65 Lot - 793','Haslet','Texas',96,'Dallas');
INSERT INTO communities VALUES(390,64,'Walsh Ranch','Fort Worth','Texas',96,'Dallas');
INSERT INTO communities VALUES(391,64,'Reunion','Rhome','Texas',96,'Dallas');
INSERT INTO communities VALUES(392,64,'Talon Hills 60''/70'' - 20372.60','Fort Worth','Texas',96,'Dallas');
INSERT INTO communities VALUES(393,64,'Reunion 40'' Lot - 212','Rhome','Texas',96,'Dallas');
INSERT INTO communities VALUES(394,64,'Adkins Park','Hurst','Texas',96,'Dallas');
INSERT INTO communities VALUES(395,64,'Adkins Park 70'' Lot - 20361.70','Hurst','Texas',96,'Dallas');
INSERT INTO communities VALUES(396,64,'Myrtle Creek 60'' Lot - 20382.60','Waxahachie','Texas',96,'Dallas');
INSERT INTO communities VALUES(397,64,'Reunion 60''/70'' Lot - 169','Rhome','Texas',96,'Dallas');
INSERT INTO communities VALUES(398,64,'Myrtle Creek 71 20382.71','Waxahachie','Texas',96,'Dallas');
INSERT INTO communities VALUES(399,64,'Perry Homes DFW (Homeowner)','Northlake','Texas',96,'Dallas');
INSERT INTO communities VALUES(402,65,'Unknow Decatur -Funderbuk Residence','Decatur','Texas',47,'Dallas');
INSERT INTO communities VALUES(403,65,'2130 Ridge Ln-TTR','Grapevine','Texas',47,'Dallas');
INSERT INTO communities VALUES(404,65,'10325 Reata Estates Dr-TTR','Mansfield','Texas',47,'Dallas');
INSERT INTO communities VALUES(405,65,'6613 Sunny Hill Dr-TTR','Watauga','Texas',47,'Dallas');
INSERT INTO communities VALUES(406,65,'3239 Highgate-TTR','Gunter','Texas',47,'Dallas');
INSERT INTO communities VALUES(407,65,'4828 Bryce Ave. (TTR)','Fort Worth','Texas',47,'Dallas');
INSERT INTO communities VALUES(408,65,'2130 E Highland St.-Reroof','Southlake','Texas',47,'Dallas');
INSERT INTO communities VALUES(409,65,'5804 Lighthouse Dr-TTR','Flower Mound','Texas',47,'Dallas');
INSERT INTO communities VALUES(416,68,'Magnolia West','Westworth Village','Texas',118,'Dallas');
INSERT INTO communities VALUES(417,68,'Dobbins Crossing','Corsicana','Texas',118,'Dallas');
INSERT INTO communities VALUES(418,68,'Aero Vista','Caddo Mills','Texas',118,'Dallas');
INSERT INTO communities VALUES(419,68,'Terra Escalante','Blue Ridge','Texas',118,'Dallas');
INSERT INTO communities VALUES(420,68,'creek view','Van Alstyne','Texas',118,'Dallas');
INSERT INTO communities VALUES(421,68,'Creekview','Van Alstyne','Texas',118,'Dallas');
INSERT INTO communities VALUES(422,68,'Sanger Meadow','Sanger','Texas',118,'Dallas');
INSERT INTO communities VALUES(424,68,'Saddle Brook','Van Alstyne','Texas',118,'Dallas');
INSERT INTO communities VALUES(425,68,'Clear Sky','Valley View','Texas',118,'Dallas');
INSERT INTO communities VALUES(426,68,'Fannin Ranch','Leonard','Texas',118,'Dallas');
INSERT INTO communities VALUES(427,68,'Parker Heights','Valley View','Texas',118,'Dallas');
INSERT INTO communities VALUES(428,68,'Liberty Pointe','Gainsville','Texas',118,'Dallas');
INSERT INTO communities VALUES(429,68,'Northstar','Haslet','Texas',118,'Dallas');
INSERT INTO communities VALUES(430,68,'Lakeview Heights','Azle','Texas',118,'Dallas');
INSERT INTO communities VALUES(431,68,'Green Meadows','Anna','Texas',118,'Dallas');
INSERT INTO communities VALUES(432,68,'Saddleback Estates','Boyd','Texas',118,'Dallas');
INSERT INTO communities VALUES(433,68,'Crystal Palace Estates','Alvarado','Texas',118,'Dallas');
INSERT INTO communities VALUES(434,68,'Eagle Ridge Estates','Weatherford','Texas',118,'Dallas');
INSERT INTO communities VALUES(435,68,'Hickory Place','Weatherford','Texas',118,'Dallas');
INSERT INTO communities VALUES(436,68,'Covenant Springs','Springtown','Texas',118,'Dallas');
INSERT INTO communities VALUES(437,68,'Morningstar','Aledo','Texas',118,'Dallas');
INSERT INTO communities VALUES(438,68,'Covenant Park','Springtown','Texas',118,'Dallas');
INSERT INTO communities VALUES(439,68,'Fairview Meadows','Rhome','Texas',118,'Dallas');
INSERT INTO communities VALUES(440,68,'Northstar','Fort Worth','Texas',118,'Dallas');
INSERT INTO communities VALUES(441,68,'Hillcrest Meadows North','Decatur','Texas',118,'Dallas');
INSERT INTO communities VALUES(442,68,'Holbrook Farm','Springtown','Texas',118,'Dallas');
INSERT INTO communities VALUES(443,68,'Fairview Meadows','New Fairview','Texas',118,'Dallas');
INSERT INTO communities VALUES(444,68,'Zion Trails','Poolville','Texas',118,'Dallas');
INSERT INTO communities VALUES(445,68,'Regent Park','Springtown','Texas',118,'Dallas');
INSERT INTO communities VALUES(446,68,'Rocky Top','Krum','Texas',118,'Dallas');
INSERT INTO communities VALUES(447,68,'zzz-Chisholm Trail Estates','Godley','Texas',118,'Dallas');
INSERT INTO communities VALUES(448,68,'Las Ventanas','Fort Worth','Texas',118,'Dallas');
INSERT INTO communities VALUES(449,68,'Zion Hill','Poolville','Texas',118,'Dallas');
INSERT INTO communities VALUES(450,68,'Silverstone','Weatherford','Texas',118,'Dallas');
INSERT INTO communities VALUES(452,68,'Fannin Ranch *Reroof','Leonard','Texas',118,'Dallas');
INSERT INTO communities VALUES(453,68,'Reroof','Kemp','Texas',118,'Dallas');
INSERT INTO communities VALUES(454,68,'Midway Ridge','Ponder','Texas',118,'Dallas');
INSERT INTO communities VALUES(455,68,'Sanger Meadow *Reroof*','Sanger','Texas',118,'Dallas');
INSERT INTO communities VALUES(458,68,'Honeysuckle Ranch','Paradise','Texas',118,'Dallas');
INSERT INTO communities VALUES(459,68,'Nash Estates','Sherman','Texas',118,'Dallas');
INSERT INTO communities VALUES(460,68,'zzz-Rocky Ridge Ph II and Ph III','Weatherford','Texas',118,'Dallas');
INSERT INTO communities VALUES(461,68,'King Crossing Estates','Dallas','Texas',118,'Dallas');
INSERT INTO communities VALUES(462,68,'King Crossing Estates','Van Alstyne','Texas',118,'Dallas');
INSERT INTO communities VALUES(463,68,'Cottages at Beltmill','Saginaw','Texas',118,'Dallas');
INSERT INTO communities VALUES(472,68,'Hillview Addition','Decatur','Texas',118,'Dallas');
INSERT INTO communities VALUES(473,7,'Nelson Lake Estates','Rockwall','Texas',4,'Dallas');
INSERT INTO communities VALUES(474,7,'Walden Pond','Forney','Texas',4,'Dallas');
INSERT INTO communities VALUES(475,7,'Creekside','Royse City','Texas',4,'Dallas');
INSERT INTO communities VALUES(476,7,'Havenwood Bluffs','Dallas','Texas',4,'Dallas');
INSERT INTO communities VALUES(477,69,'12530 Harvest Meadow Dr-TTR','Frisco','Texas',47,'Dallas');
INSERT INTO communities VALUES(478,69,'9845 Lenel Pl-TTR','Dallas','Texas',47,'Dallas');
INSERT INTO communities VALUES(480,70,'Light Farms Brenham','Celina','Texas',10,'Dallas');
INSERT INTO communities VALUES(481,70,'Brookside Fields 50''s','Frisco','Texas',10,'Dallas');
INSERT INTO communities VALUES(483,70,'Farm Reagan I 80''s','Celina','Texas',10,'Dallas');
INSERT INTO communities VALUES(484,70,'L/Farm Graham III 70''s','Celina','Texas',10,'Dallas');
INSERT INTO communities VALUES(485,70,'Brookside Field 40s','Frisco','Texas',10,'Dallas');
INSERT INTO communities VALUES(486,70,'L/Farm Graham III 80''s','Celina','Texas',10,'Dallas');
INSERT INTO communities VALUES(487,70,'L/Farm Graham III 50''s','Celina','Texas',10,'Dallas');
INSERT INTO communities VALUES(489,70,'Tavolo Park 50s','Fort Worth','Texas',10,'Dallas');
INSERT INTO communities VALUES(490,70,'Tavolo Park 60s','Fort Worth','Texas',10,'Dallas');
INSERT INTO communities VALUES(491,70,'The Cottages 40''s','Celina','Texas',10,'Dallas');
INSERT INTO communities VALUES(492,70,'Est RockHill','Frisco','Texas',10,'Dallas');
INSERT INTO communities VALUES(493,70,'Estates at Rockhill','Frisco','Texas',10,'Dallas');
INSERT INTO communities VALUES(494,70,'Homestead 72''s','Rockwall','Texas',10,'Dallas');
INSERT INTO communities VALUES(496,70,'Homestead 62''s','Rockwall','Texas',10,'Dallas');
INSERT INTO communities VALUES(497,70,'Edgewater 40''s','Fate','Texas',10,'Dallas');
INSERT INTO communities VALUES(498,70,'Edgewater 50''s','Fate','Texas',10,'Dallas');
INSERT INTO communities VALUES(499,70,'Solterra 60''s','Mesquite','Texas',10,'Dallas');
INSERT INTO communities VALUES(500,70,'Devonshire 50''s','Forney','Texas',10,'Dallas');
INSERT INTO communities VALUES(501,70,'Devonshire 60''s','Forney','Texas',10,'Dallas');
INSERT INTO communities VALUES(502,70,'Brookside Fields 40''s','Frisco','Texas',86,'Dallas');
INSERT INTO communities VALUES(505,70,'Park Place','Prosper','Texas',10,'Dallas');
INSERT INTO communities VALUES(506,46,'Harmony Court','Arlington','Texas',96,'Dallas');
INSERT INTO communities VALUES(507,14,'Steve integrity Group','Azle','Texas',50,'Dallas');
INSERT INTO communities VALUES(508,73,'Rio Vista','Aledo','Texas',10,'Dallas');
INSERT INTO communities VALUES(509,74,'DeSoto, TX 75115','DeSoto','Texas',96,'Dallas');
INSERT INTO communities VALUES(510,74,'Oxford ranch','Waxahachie','Texas',96,'Dallas');
INSERT INTO communities VALUES(511,74,'Coles Crossing','DeSoto','Texas',96,'Dallas');
INSERT INTO communities VALUES(514,74,'Horizon Estates','Midlothian','Texas',96,'Dallas');
INSERT INTO communities VALUES(515,74,'Plymouth Park North','Irving','Texas',96,'Dallas');
INSERT INTO communities VALUES(516,74,'Dustin Manor','Midlothian','Texas',96,'Dallas');
INSERT INTO communities VALUES(517,74,'Crystal Lake','Red Oak','Texas',96,'Dallas');
INSERT INTO communities VALUES(518,74,'Woodcreek','Fate','Texas',96,'Dallas');
INSERT INTO communities VALUES(519,74,'Sagebrush','Midlothian','Texas',96,'Dallas');
INSERT INTO communities VALUES(520,74,'Ten Mile Creek III','DeSoto','Texas',96,'Dallas');
INSERT INTO communities VALUES(521,74,'Canterbury Cove','Rowlett','Texas',96,'Dallas');
INSERT INTO communities VALUES(522,74,'Tem Mile Creek III','DeSoto','Texas',96,'Dallas');
INSERT INTO communities VALUES(523,74,'Malabar Hill','Prosper','Texas',96,'Dallas');
INSERT INTO communities VALUES(524,74,'Amherst','Corinth','Texas',96,'Dallas');
INSERT INTO communities VALUES(525,74,'Lynx Hollow','Heath','Texas',96,'Dallas');
INSERT INTO communities VALUES(526,74,'Mustang Place','Forney','Texas',96,'Dallas');
INSERT INTO communities VALUES(527,74,'Courts of Bonnie Brae','Denton','Texas',96,'Dallas');
INSERT INTO communities VALUES(528,74,'Stonehenge','Sanger','Texas',96,'Dallas');
INSERT INTO communities VALUES(529,74,'Glen Heights (Homeowner)','Midlothian','Texas',96,'Dallas');
INSERT INTO communities VALUES(532,75,'3040 Winding Creek Trl - TTR','Aledo','Texas',47,'Dallas');
INSERT INTO communities VALUES(533,75,'3035 Winding Creek Trl-TTR','Aledo','Texas',47,'Dallas');
INSERT INTO communities VALUES(534,79,'465 Palmilla Dr-TTR','Gordanville','Texas',47,'Dallas');
INSERT INTO communities VALUES(535,79,'146 Falls Creek Cir-TTR','Gainesville','Texas',47,'Dallas');
INSERT INTO communities VALUES(536,79,'1981 Nobile Rd -TTR','Nocona','Texas',47,'Dallas');
INSERT INTO communities VALUES(537,79,'751 Badminton Dr.-TTR','Argyle','Texas',47,'Dallas');
INSERT INTO communities VALUES(538,79,'419 Tipps Rd-TTR','Whitesboro','Texas',47,'Dallas');
INSERT INTO communities VALUES(539,80,'14500 Warbler Ln','Haslet','Texas',47,'Dallas');
INSERT INTO communities VALUES(540,80,'1119 Wade Hampton St.-TTR','Benbrook','Texas',47,'Dallas');
INSERT INTO communities VALUES(547,17,'Trails of Zion','Poolville','Texas',2,'Dallas');
INSERT INTO communities VALUES(548,17,'Liberty Meadows 1','Weatherford','Texas',2,'Dallas');
INSERT INTO communities VALUES(549,17,'Feathers Edge','Weatherford','Texas',2,'Dallas');
INSERT INTO communities VALUES(550,17,'Westover Acres','Westworth Village','Texas',2,'Dallas');
INSERT INTO communities VALUES(551,17,'Kally Way','Weatherford','Texas',2,'Dallas');
INSERT INTO communities VALUES(552,17,'Graceview Estates','Weatherford','Texas',2,'Dallas');
INSERT INTO communities VALUES(553,17,'Liberty Meadows 1','Poolville','Texas',2,'Dallas');
INSERT INTO communities VALUES(554,17,'Liberty Meadows 2','Weatherford','Texas',2,'Dallas');
INSERT INTO communities VALUES(555,17,'Revere Creek','Weatherford','Texas',2,'Dallas');
INSERT INTO communities VALUES(556,17,'Revere Creek','Peaster','Texas',2,'Dallas');
INSERT INTO communities VALUES(557,17,'Trails of Zion','Weatherford','Texas',2,'Dallas');
INSERT INTO communities VALUES(558,17,'Stafford Farm Estates','Perrin','Texas',2,'Dallas');
INSERT INTO communities VALUES(559,17,'Liberty Meadows 3','Weatherford','Texas',2,'Dallas');
INSERT INTO communities VALUES(560,17,'Freeman Ranch Estates','Weatherford','Texas',2,'Dallas');
INSERT INTO communities VALUES(561,17,'Covenant Park','Springtown','Texas',2,'Dallas');
INSERT INTO communities VALUES(562,17,'Stillwater Lake Estates','Godley','Texas',2,'Dallas');
INSERT INTO communities VALUES(563,17,'Trinity Meadows','Azle','Texas',2,'Dallas');
INSERT INTO communities VALUES(564,17,'Reroof','Weatherford','Texas',2,'Dallas');
INSERT INTO communities VALUES(565,17,'Reroof','Peaster','Texas',2,'Dallas');
INSERT INTO communities VALUES(566,81,'Reunion','Rhome','Texas',10,'Dallas');
INSERT INTO communities VALUES(567,81,'Creekside','Royse City','Texas',10,'Dallas');
INSERT INTO communities VALUES(568,81,'Walden Pond 40''s','Forney','Texas',10,'Dallas');
INSERT INTO communities VALUES(569,81,'Walden Pond 50''s','Forney','Texas',10,'Dallas');
INSERT INTO communities VALUES(570,81,'Brookville Estates','Forney','Texas',10,'Dallas');
INSERT INTO communities VALUES(571,81,'Elevon 50''s','Lavon','Texas',10,'Dallas');
INSERT INTO communities VALUES(572,81,'Elevon 40s','Lavon','Texas',10,'Dallas');
INSERT INTO communities VALUES(573,81,'Myrtle Creek','Waxahachie','Texas',10,'Dallas');
INSERT INTO communities VALUES(575,81,'Eagle Creek','Denton','Texas',10,'Dallas');
INSERT INTO communities VALUES(576,82,'Canyon Creek','Granbury','Texas',96,'Dallas');
INSERT INTO communities VALUES(578,82,'Westover Acres','Westworth Village','Texas',96,'Dallas');
INSERT INTO communities VALUES(583,82,'Lucky Ridge Estates','Boyd','Texas',96,'Dallas');
INSERT INTO communities VALUES(584,83,'Aster Park 50','McKinney','Texas',10,'Dallas');
INSERT INTO communities VALUES(585,83,'Creekside 40','Royse City','Texas',10,'Dallas');
INSERT INTO communities VALUES(586,83,'Wildflower Central 40','Fort Worth','Texas',10,'Dallas');
INSERT INTO communities VALUES(587,83,'Wildflower Central 50','Fort Worth','Texas',10,'Dallas');
INSERT INTO communities VALUES(588,83,'West Crossing','Anna','Texas',10,'Dallas');
INSERT INTO communities VALUES(589,83,'Creekside 30','Royse City','Texas',10,'Dallas');
INSERT INTO communities VALUES(590,83,'Ten Mile Creek 45','Celina','Texas',79,'Dallas');
INSERT INTO communities VALUES(591,83,'Ten Mile Creek 50','Celina','Texas',79,'Dallas');
INSERT INTO communities VALUES(592,83,'Wildflower SFR','Fort Worth','Texas',10,'Dallas');
INSERT INTO communities VALUES(593,83,'Lily Estates','Celina','Texas',10,'Dallas');
INSERT INTO communities VALUES(595,85,'Wellington estates','Greenville','Texas',118,'Dallas');
INSERT INTO communities VALUES(602,85,'Delano Estates','Greenville','Texas',118,'Dallas');
INSERT INTO communities VALUES(603,18,'Villas at Long Branch','Rowlett','Texas',2,'Dallas');
INSERT INTO communities VALUES(604,18,'Merritt Village','Rowlett','Texas',2,'Dallas');
INSERT INTO communities VALUES(605,18,'Sunset Crossing','Mansfield','Texas',2,'Dallas');
INSERT INTO communities VALUES(607,18,'Colby Crossing','Mansfield','Texas',2,'Dallas');
INSERT INTO communities VALUES(608,18,'Estates at Rockhill','Frisco','Texas',2,'Dallas');
INSERT INTO communities VALUES(610,18,'Walton Ridge','Corinth','Texas',2,'Dallas');
INSERT INTO communities VALUES(611,18,'Gideon Grove','Rockwall','Texas',2,'Dallas');
INSERT INTO communities VALUES(612,18,'Walton Ridge: Texas Series - TX','Corinth','Texas',2,'Dallas');
INSERT INTO communities VALUES(614,18,'Clear Lake Estates','Grand Prairie','Texas',2,'Dallas');
INSERT INTO communities VALUES(615,18,'Walton Ridge: Colorado Series','Corinth','Texas',2,'Dallas');
INSERT INTO communities VALUES(616,18,'Breezy Hill','Rockwall','Texas',2,'Dallas');
INSERT INTO communities VALUES(618,18,'Lake Shore Village','Rowlett','Texas',2,'Dallas');
INSERT INTO communities VALUES(619,18,'Service* Hillside Villas','North Richland Hills','Texas',2,'Dallas');
INSERT INTO communities VALUES(621,18,'Woodside State','Rowlett','Texas',2,'Dallas');
INSERT INTO communities VALUES(623,18,'Nelson Lake Estates','Rockwall','Texas',2,'Dallas');
INSERT INTO communities VALUES(624,18,'Las Brisas at Stoney Creek','Sunnyvale','Texas',2,'Dallas');
INSERT INTO communities VALUES(625,18,'Reroof','Red Oak','Texas',2,'Dallas');
INSERT INTO communities VALUES(626,18,'Winding Creek','Rockwall','Texas',2,'Dallas');
INSERT INTO communities VALUES(628,18,'Ridge Pointe Estates','McLendon-Chisholm','Texas',2,'Dallas');
CREATE TABLE acculynx_workflow_milestones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    acculynx_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO acculynx_workflow_milestones VALUES(1,'1','',NULL,'2025-10-31 14:38:06','2025-10-31 18:43:26');
INSERT INTO acculynx_workflow_milestones VALUES(2,'2','',NULL,'2025-10-31 14:38:06','2025-10-31 18:43:26');
INSERT INTO acculynx_workflow_milestones VALUES(3,'3','',NULL,'2025-10-31 14:38:06','2025-10-31 18:43:26');
INSERT INTO acculynx_workflow_milestones VALUES(4,'4','',NULL,'2025-10-31 14:38:06','2025-10-31 18:43:26');
INSERT INTO acculynx_workflow_milestones VALUES(5,'5','',NULL,'2025-10-31 14:38:06','2025-10-31 18:43:26');
INSERT INTO acculynx_workflow_milestones VALUES(6,'6','',NULL,'2025-10-31 14:38:06','2025-10-31 18:43:26');
CREATE TABLE acculynx_statuses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    acculynx_id TEXT NOT NULL UNIQUE,
    milestone_id INTEGER,
    name TEXT NOT NULL,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (milestone_id) REFERENCES acculynx_workflow_milestones(id) ON DELETE CASCADE
);
CREATE TABLE acculynx_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    acculynx_id TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    mobile_phone TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    company_name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO acculynx_contacts VALUES(1,'c45fd288-09b5-ed11-915b-ac1f6b0fcb12','Edison ','Charlton','Edison  Charlton',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(2,'ceddad7b-39b5-ed11-915b-ac1f6b0fcb12','Paul','Diggs','Paul Diggs',NULL,NULL,NULL,'','','','','','Meritage','2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(3,'752fe592-3eb5-ed11-915b-ac1f6b0fcb12','Plez & Krisri','Transou','Plez & Krisri Transou',NULL,NULL,NULL,'','','','','','Trinity Clasic Homes','2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(4,'1de05657-b1b6-ed11-915b-ac1f6b0fcb12','Jonni','Test','Jonni Test',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(5,'02fe1bd0-41b8-ed11-915b-ac1f6b0fcb12','Wade & Sarah','Weise','Wade & Sarah Weise',NULL,NULL,NULL,'','','','','','Riverside','2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(6,'b51208ae-44b8-ed11-915b-ac1f6b0fcb12','Mark','Murphee','Mark Murphee',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(7,'164c9d97-46b8-ed11-915b-ac1f6b0fcb12','Scott','Gregory','Scott Gregory',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(8,'37b21987-4fb8-ed11-915b-ac1f6b0fcb12','Eric & Gensene','Nailor','Eric & Gensene Nailor',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(9,'4d18211e-e7b9-ed11-915b-ac1f6b0fcb12','Kayla','Vines','Kayla Vines',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(10,'c803f33d-efb9-ed11-915b-ac1f6b0fcb12','Kayla','Vines','Kayla Vines',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(11,'85848e4c-f9b9-ed11-915b-ac1f6b0fcb12','Heather','Stepp','Heather Stepp',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(12,'d459a709-fbb9-ed11-915b-ac1f6b0fcb12','Adrian','Rubalcava','Adrian Rubalcava',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(13,'6504acc8-fbb9-ed11-915b-ac1f6b0fcb12','Chris','Mischke','Chris Mischke',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(14,'d0672b32-fdb9-ed11-915b-ac1f6b0fcb12','Miriam','Stevenson','Miriam Stevenson',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(15,'9823e2be-fdb9-ed11-915b-ac1f6b0fcb12','Ronny','Meinen','Ronny Meinen',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(16,'1c700352-f7bb-ed11-915b-ac1f6b0fcb12','Tim','Backus','Tim Backus',NULL,NULL,NULL,'','','','','','Har-Conn Aerospace','2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(17,'c2675928-2bbc-ed11-915b-ac1f6b0fcb12','Randy','Shierry','Randy Shierry',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(18,'9155e42c-72bc-ed11-915b-ac1f6b0fcb12','Kurt','Cameron','Kurt Cameron',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(19,'5bb517db-15bd-ed11-915b-ac1f6b0fcb12','Kevin','Baker','Kevin Baker',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(20,'ef609abb-16bd-ed11-915b-ac1f6b0fcb12','Mary','Ohman','Mary Ohman',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(21,'99e5aec0-17bd-ed11-915b-ac1f6b0fcb12','Mary','Camilleri','Mary Camilleri',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(22,'7128224e-23bd-ed11-915b-ac1f6b0fcb12','Debbie','Payne','Debbie Payne',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(23,'2e813bb6-4abd-ed11-915b-ac1f6b0fcb12','Zach','Swain','Zach Swain',NULL,NULL,NULL,'','','','','','Ameriprise Financial','2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(24,'f6bf5b50-4dbd-ed11-915b-ac1f6b0fcb12','Wayne','Miles','Wayne Miles',NULL,NULL,NULL,'','','','','','Miles Dental','2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
INSERT INTO acculynx_contacts VALUES(25,'f8efd3cf-58bd-ed11-915b-ac1f6b0fcb12','Kenneth','Heard','Kenneth Heard',NULL,NULL,NULL,'','','','','',NULL,'2025-10-31 18:43:27','2025-10-31 18:43:27','2025-10-31 18:43:27');
CREATE TABLE acculynx_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    acculynx_id TEXT NOT NULL UNIQUE,
    job_name TEXT,
    job_number TEXT,
    milestone TEXT,
    status TEXT,
    status_id INTEGER,
    contact_id INTEGER,
    assigned_to_user_id TEXT,
    assigned_to_user_name TEXT,
    created_date TIMESTAMP,
    modified_date TIMESTAMP,
    milestone_date TIMESTAMP,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    latitude REAL,
    longitude REAL,
    job_type TEXT,
    sales_rep TEXT,
    estimator TEXT,
    project_manager TEXT,
    insurance_company TEXT,
    claim_number TEXT,
    deductible REAL,
    total_amount REAL,
    notes TEXT,
    raw_data TEXT,  -- Store full JSON response for reference
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES acculynx_contacts(id) ON DELETE SET NULL,
    FOREIGN KEY (status_id) REFERENCES acculynx_statuses(id) ON DELETE SET NULL
);
INSERT INTO acculynx_jobs VALUES(1,'43fb6d9a-2689-4f94-bc0f-9151347cd8e3','Pratika Mohan',NULL,NULL,NULL,NULL,NULL,'','','2025-04-02 18:51:55','2025-04-09 18:22:39','2025-04-02 18:51:55','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'{"id": "43fb6d9a-2689-4f94-bc0f-9151347cd8e3", "contacts": [{"id": "7cf14375-c22b-4e1b-b2da-15d06972c96b", "contact": {"id": "4a1e8387-f30f-f011-8aef-ea808803f41d", "_link": "https://api.acculynx.com/api/v2/contacts/4a1e8387-f30f-f011-8aef-ea808803f41d"}, "isPrimary": true, "relationToPrimary": "", "_link": "https://api.acculynx.com/api/v2/jobs/43fb6d9a-2689-4f94-bc0f-9151347cd8e3/contacts/7cf14375-c22b-4e1b-b2da-15d06972c96b"}], "locationAddress": {"street1": "2121 Gustavus Drive", "city": "Sherman", "state": {"id": 43, "name": "Texas", "abbreviation": "TX", "_link": "https://api.acculynx.com/api/v2/acculynx/countries/1/states/43"}, "zipCode": "75092", "country": {"id": 1, "name": "United States", "abbreviation": "US", "_link": "https://api.acculynx.com/api/v2/acculynx/countries/1"}}, "geoLocation": {"latitude": 33.6263706, "longitude": -96.6346951}, "tradeTypes": [], "leadDeadReason": "", "currentMilestone": "Lead", "milestoneDate": "2025-04-02T18:51:55Z", "createdDate": "2025-04-02T18:51:55Z", "modifiedDate": "2025-04-09T18:22:39Z", "jobName": "Pratika Mohan", "jobNumber": "", "priority": "Normal", "_link": "https://api.acculynx.com/api/v2/jobs/43fb6d9a-2689-4f94-bc0f-9151347cd8e3"}','2025-10-31 18:43:26','2025-10-31 18:43:26','2025-10-31 18:43:26');
INSERT INTO acculynx_jobs VALUES(2,'8a6d9bdb-4ced-49ff-a9e9-0ed1cc25e919','john test',NULL,NULL,NULL,NULL,NULL,'','','2025-05-30 19:46:56','2025-05-30 19:46:57','2025-05-30 19:46:56','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'{"id": "8a6d9bdb-4ced-49ff-a9e9-0ed1cc25e919", "contacts": [{"id": "5546e359-3590-451a-a2f5-f9216d0669af", "contact": {"id": "8f69e1d6-8e3d-f011-8af3-ea808803f41d", "_link": "https://api.acculynx.com/api/v2/contacts/8f69e1d6-8e3d-f011-8af3-ea808803f41d"}, "isPrimary": true, "relationToPrimary": "", "_link": "https://api.acculynx.com/api/v2/jobs/8a6d9bdb-4ced-49ff-a9e9-0ed1cc25e919/contacts/5546e359-3590-451a-a2f5-f9216d0669af"}], "locationAddress": {"country": {"id": 1, "name": "United States", "abbreviation": "US", "_link": "https://api.acculynx.com/api/v2/acculynx/countries/1"}}, "geoLocation": {"latitude": 38.7945952, "longitude": -106.5348379}, "tradeTypes": [], "leadDeadReason": "", "currentMilestone": "Lead", "milestoneDate": "2025-05-30T19:46:56Z", "createdDate": "2025-05-30T19:46:56Z", "modifiedDate": "2025-05-30T19:46:57Z", "jobName": "john test", "jobNumber": "", "priority": "Normal", "_link": "https://api.acculynx.com/api/v2/jobs/8a6d9bdb-4ced-49ff-a9e9-0ed1cc25e919"}','2025-10-31 18:43:26','2025-10-31 18:43:26','2025-10-31 18:43:26');
INSERT INTO acculynx_jobs VALUES(3,'ce6d29d9-33ab-4964-bdda-bafe3e72c741','Talat Robert',NULL,NULL,NULL,NULL,NULL,'','','2025-06-01 00:26:48','2025-06-01 00:26:48','2025-06-01 00:26:48','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'{"id": "ce6d29d9-33ab-4964-bdda-bafe3e72c741", "contacts": [{"id": "8d1c2956-c92a-4c0e-8322-cdad402dc4aa", "contact": {"id": "2ad6411a-7f3e-f011-8af3-ea808803f41d", "_link": "https://api.acculynx.com/api/v2/contacts/2ad6411a-7f3e-f011-8af3-ea808803f41d"}, "isPrimary": true, "relationToPrimary": "", "_link": "https://api.acculynx.com/api/v2/jobs/ce6d29d9-33ab-4964-bdda-bafe3e72c741/contacts/8d1c2956-c92a-4c0e-8322-cdad402dc4aa"}], "locationAddress": {"street1": "5309 anchor cove cir", "zipCode": "75043", "country": {"id": 1, "name": "United States", "abbreviation": "US", "_link": "https://api.acculynx.com/api/v2/acculynx/countries/1"}}, "geoLocation": {"latitude": 32.8487431, "longitude": -96.55375550000001}, "tradeTypes": [], "leadDeadReason": "", "currentMilestone": "Lead", "milestoneDate": "2025-06-01T00:26:48Z", "createdDate": "2025-06-01T00:26:48Z", "modifiedDate": "2025-06-01T00:26:48Z", "jobName": "Talat Robert", "jobNumber": "", "priority": "Normal", "_link": "https://api.acculynx.com/api/v2/jobs/ce6d29d9-33ab-4964-bdda-bafe3e72c741"}','2025-10-31 18:43:26','2025-10-31 18:43:26','2025-10-31 18:43:26');
INSERT INTO acculynx_jobs VALUES(4,'4b6aa046-48b9-417a-b340-360181aa6f9e','Deborah Vincent',NULL,NULL,NULL,NULL,NULL,'','','2025-06-02 00:54:18','2025-06-02 00:54:18','2025-06-02 00:54:18','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'{"id": "4b6aa046-48b9-417a-b340-360181aa6f9e", "contacts": [{"id": "801b71d3-5cbd-41f9-bdee-85253cf4699d", "contact": {"id": "f27a7a1c-4c3f-f011-8af3-ea808803f41d", "_link": "https://api.acculynx.com/api/v2/contacts/f27a7a1c-4c3f-f011-8af3-ea808803f41d"}, "isPrimary": true, "relationToPrimary": "", "_link": "https://api.acculynx.com/api/v2/jobs/4b6aa046-48b9-417a-b340-360181aa6f9e/contacts/801b71d3-5cbd-41f9-bdee-85253cf4699d"}], "locationAddress": {"street1": "209 robin hood rd", "zipCode": "76245", "country": {"id": 1, "name": "United States", "abbreviation": "US", "_link": "https://api.acculynx.com/api/v2/acculynx/countries/1"}}, "geoLocation": {"latitude": 33.8545403, "longitude": -96.8075071}, "tradeTypes": [], "leadDeadReason": "", "currentMilestone": "Lead", "milestoneDate": "2025-06-02T00:54:18Z", "createdDate": "2025-06-02T00:54:18Z", "modifiedDate": "2025-06-02T00:54:18Z", "jobName": "Deborah Vincent", "jobNumber": "", "priority": "Normal", "_link": "https://api.acculynx.com/api/v2/jobs/4b6aa046-48b9-417a-b340-360181aa6f9e"}','2025-10-31 18:43:26','2025-10-31 18:43:26','2025-10-31 18:43:26');
CREATE TABLE materials (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    manufacturer TEXT,
    product_category TEXT,
    distributor TEXT,
    ticker_symbol TEXT,
    current_price REAL,
    previous_price REAL,
    last_updated TEXT,
    updated_by INTEGER
);
INSERT INTO materials VALUES(151,'Starter Strip','DFW','Atlas','Flashing','ABCSupply','ABC',301.0,345.0,'2025-11-25T19:17:07.153Z',2);
INSERT INTO materials VALUES(152,'Chimney Flashing','ATL','Malarky','Decking','Other','OTH',89.75,NULL,'2025-11-25T19:17:07.190Z',2);
INSERT INTO materials VALUES(153,'Roofing Underlayment (Felt)','OKC','Tri-Built','Underlayment','Beacon','QXO',48.89999999999999858,NULL,'2025-11-25T19:17:07.215Z',2);
INSERT INTO materials VALUES(154,'Example Asphalt Shingles','HOU','GAF','Shingle','ABCSupply','ABC',23.44999999999999929,NULL,'2025-11-25T19:17:07.240Z',2);
INSERT INTO materials VALUES(155,'Elastomeric Roof Coating','ATX','CertainTeed','Accessory','SRSProducts','SRS',156.0,NULL,'2025-11-25T19:17:07.265Z',2);
INSERT INTO materials VALUES(156,'Gutter Guards','ARK','Owens Corning','Accessory','CommercialDistributors','CDH',94.5999999999999944,NULL,'2025-11-25T19:17:07.290Z',2);
INSERT INTO materials VALUES(159,'Malarky SuperRidge','DFW','Malarky','Accessory','ABCSupply','ABC',28.76999999999999958,NULL,'2025-11-25T19:50:00.309Z',2);
INSERT INTO materials VALUES(160,'CT Landmark AR','DFW','CertainTeed','Shingle','ABCSupply','ABC',93.5,NULL,'2025-11-26T16:35:19.447Z',2);
INSERT INTO materials VALUES(161,'CT AR Xt25','DFW','CertainTeed','Shingle','ABCSupply','ABC',87.5,NULL,'2025-11-26T16:35:19.492Z',2);
INSERT INTO materials VALUES(162,'CT Patriot','DFW','CertainTeed','Shingle','ABCSupply','ABC',89.5,NULL,'2025-11-26T16:35:19.515Z',2);
INSERT INTO materials VALUES(163,'GAF Roy Sov','DFW','GAF','Shingle','ABCSupply','ABC',96.9800000000000039,NULL,'2025-11-26T16:35:19.537Z',2);
INSERT INTO materials VALUES(164,'GAF NS','DFW','GAF','Shingle','ABCSupply','ABC',87.03000000000000113,NULL,'2025-11-26T16:35:19.560Z',2);
INSERT INTO materials VALUES(165,'GAF HDZ','DFW','GAF','Shingle','ABCSupply','ABC',112.0,NULL,'2025-11-26T16:35:19.582Z',2);
INSERT INTO materials VALUES(166,'OC Supreme','DFW','Owens Corning','Shingle','ABCSupply','ABC',76.5,NULL,'2025-11-26T16:35:19.605Z',2);
INSERT INTO materials VALUES(167,'OC Oakridge','DFW','Owens Corning','Shingle','ABCSupply','ABC',100.0,NULL,'2025-11-26T16:35:19.628Z',2);
INSERT INTO materials VALUES(168,'OC Oakridge TruDef','DFW','Owens Corning','Shingle','ABCSupply','ABC',106.0199999999999961,NULL,'2025-11-26T16:35:19.650Z',2);
INSERT INTO materials VALUES(169,'OC Duration','DFW','Owens Corning','Shingle','ABCSupply','ABC',117.0,NULL,'2025-11-26T16:35:19.675Z',2);
INSERT INTO materials VALUES(170,'TAMKO Elite','DFW','Tamko','Shingle','ABCSupply','ABC',82.65000000000000569,NULL,'2025-11-26T16:35:19.699Z',2);
INSERT INTO materials VALUES(171,'TAMKO Heritage','DFW','Tamko','Shingle','ABCSupply','ABC',90.29999999999999716,NULL,'2025-11-26T16:35:19.722Z',2);
INSERT INTO materials VALUES(172,'IKO Marathon','DFW','IKO','Shingle','ABCSupply','ABC',86.5,NULL,'2025-11-26T16:35:19.745Z',2);
INSERT INTO materials VALUES(173,'IKO Cambridge','DFW','IKO','Shingle','ABCSupply','ABC',86.0,NULL,'2025-11-26T16:35:19.769Z',2);
INSERT INTO materials VALUES(174,'Atlas ProLam','DFW','Atlas','Shingle','ABCSupply','ABC',78.25,NULL,'2025-11-26T16:35:19.793Z',2);
INSERT INTO materials VALUES(175,'Atlas Pinnacle','DFW','Atlas','Shingle','ABCSupply','ABC',104.0100000000000051,NULL,'2025-11-26T16:35:19.816Z',2);
INSERT INTO materials VALUES(176,'Tamko 10" Starter (110LF)','DFW','Tamko','Accessory','ABCSupply','ABC',45.0,NULL,'2025-11-26T16:35:19.839Z',2);
INSERT INTO materials VALUES(177,'GAF Pro Starter (120 LF/BD)','DFW','GAF','Accessory','ABCSupply','ABC',41.0,NULL,'2025-11-26T16:35:19.862Z',2);
INSERT INTO materials VALUES(178,'OC Starter (100LF)','DFW','Owens Corning','Accessory','ABCSupply','ABC',41.0,NULL,'2025-11-26T16:35:19.885Z',2);
INSERT INTO materials VALUES(179,'Atlas Pro-Cut Starter (140LF)','DFW','Atlas','Accessory','ABCSupply','ABC',86.75,NULL,'2025-11-26T16:35:19.907Z',2);
INSERT INTO materials VALUES(180,'CT Swiftstart (116 LF)','DFW','CertainTeed','Accessory','ABCSupply','ABC',55.0,NULL,'2025-11-26T16:35:19.929Z',2);
INSERT INTO materials VALUES(181,'15# Felt','DFW','Other','Underlayment','ABCSupply','ABC',22.5,NULL,'2025-11-26T16:35:19.952Z',2);
INSERT INTO materials VALUES(182,'30# Felt','DFW','Other','Underlayment','ABCSupply','ABC',22.5,NULL,'2025-11-26T16:35:19.974Z',2);
INSERT INTO materials VALUES(183,'GAP Valley Flash','DFW','Other','Underlayment','ABCSupply','ABC',31.60000000000000142,NULL,'2025-11-26T16:35:19.997Z',2);
INSERT INTO materials VALUES(184,'GAF Stormguard I/W','DFW','GAF','Underlayment','ABCSupply','ABC',102.0,NULL,'2025-11-26T16:35:20.020Z',2);
INSERT INTO materials VALUES(185,'GAP Waterguard I/W','DFW','Other','Underlayment','ABCSupply','ABC',55.95000000000000284,NULL,'2025-11-26T16:35:20.043Z',2);
INSERT INTO materials VALUES(186,'Rhino G I/W','DFW','Other','Underlayment','ABCSupply','ABC',58.0,NULL,'2025-11-26T16:35:20.065Z',2);
INSERT INTO materials VALUES(187,'Resisto Underlay 3''x65'' I/W','DFW','Other','Underlayment','ABCSupply','ABC',55.95000000000000284,NULL,'2025-11-26T16:35:20.088Z',2);
INSERT INTO materials VALUES(188,'Technoply 48" x 250''','DFW','Other','Underlayment','ABCSupply','ABC',50.0,NULL,'2025-11-26T16:35:20.110Z',2);
INSERT INTO materials VALUES(189,'CMAC MaxFelt XT 10 SQ','DFW','Other','Underlayment','ABCSupply','ABC',56.5,NULL,'2025-11-26T16:35:20.133Z',2);
INSERT INTO materials VALUES(190,'CMAC MaxFelt 15 (5SQ)','DFW','Other','Underlayment','ABCSupply','ABC',24.0,NULL,'2025-11-26T16:35:20.155Z',2);
INSERT INTO materials VALUES(191,'CMAC MaxFelt 15 (10SQ)','DFW','Other','Underlayment','ABCSupply','ABC',48.0,NULL,'2025-11-26T16:35:20.178Z',2);
INSERT INTO materials VALUES(192,'CONT Securegrip 30 4''x250''','DFW','Other','Underlayment','ABCSupply','ABC',45.0,NULL,'2025-11-26T16:35:20.200Z',2);
INSERT INTO materials VALUES(193,'CONT Xtreme WthrWarr 10 SQ','DFW','Other','Underlayment','ABCSupply','ABC',44.0,NULL,'2025-11-26T16:35:20.222Z',2);
INSERT INTO materials VALUES(194,'CONT Xtreme WthrWarr 5 SQ','DFW','Other','Underlayment','ABCSupply','ABC',23.0,NULL,'2025-11-26T16:35:20.245Z',2);
INSERT INTO materials VALUES(195,'CoverPro 1000 10 SQ','DFW','Other','Underlayment','ABCSupply','ABC',44.0,NULL,'2025-11-26T16:35:20.269Z',2);
INSERT INTO materials VALUES(196,'CoverPro 1000 5 SQ','DFW','Other','Underlayment','ABCSupply','ABC',23.0,NULL,'2025-11-26T16:35:20.292Z',2);
INSERT INTO materials VALUES(197,'Certainteed Roof Runner','DFW','CertainTeed','Underlayment','ABCSupply','ABC',115.2300000000000039,NULL,'2025-11-26T16:35:20.317Z',2);
INSERT INTO materials VALUES(198,'ABC ProGuard','DFW','Other','Underlayment','ABCSupply','ABC',52.9200000000000017,NULL,'2025-11-26T16:35:20.339Z',2);
INSERT INTO materials VALUES(199,'OC Rhino UDL Synthetic','DFW','Owens Corning','Underlayment','ABCSupply','ABC',60.0,NULL,'2025-11-26T16:35:20.363Z',2);
INSERT INTO materials VALUES(200,'OC WeatherLoc','DFW','Owens Corning','Underlayment','ABCSupply','ABC',122.7900000000000062,NULL,'2025-11-26T16:35:20.386Z',2);
INSERT INTO materials VALUES(201,'GAF StormGuard','DFW','GAF','Underlayment','ABCSupply','ABC',106.7999999999999972,NULL,'2025-11-26T16:35:20.410Z',2);
INSERT INTO materials VALUES(202,'1x2 Mill','DFW','Other','Accessory','ABCSupply','ABC',3.020000000000000017,NULL,'2025-11-26T16:35:20.433Z',2);
INSERT INTO materials VALUES(203,'Step Shingles 4x4','DFW','Other','Accessory','ABCSupply','ABC',48.57000000000000028,NULL,'2025-11-26T16:35:20.456Z',2);
INSERT INTO materials VALUES(204,'Galv Base Flashing 4x4x10','DFW','Other','Accessory','ABCSupply','ABC',10.34999999999999965,NULL,'2025-11-26T16:35:20.478Z',2);
INSERT INTO materials VALUES(205,'1.5"x1.5" Mill','DFW','Other','Accessory','ABCSupply','ABC',2.549999999999999823,NULL,'2025-11-26T16:35:20.500Z',2);
INSERT INTO materials VALUES(206,'1.5"x1.5" Painted','DFW','Other','Accessory','ABCSupply','ABC',4.349999999999999644,NULL,'2025-11-26T16:35:20.522Z',2);
INSERT INTO materials VALUES(207,'2"x2" Mill','DFW','Other','Accessory','ABCSupply','ABC',4.700000000000000177,NULL,'2025-11-26T16:35:20.545Z',2);
INSERT INTO materials VALUES(208,'2"x2" Painted','DFW','Other','Accessory','ABCSupply','ABC',5.709999999999999965,NULL,'2025-11-26T16:35:20.567Z',2);
INSERT INTO materials VALUES(209,'2"x4" Mill','DFW','Other','Accessory','ABCSupply','ABC',11.55000000000000071,NULL,'2025-11-26T16:35:20.590Z',2);
INSERT INTO materials VALUES(210,'2"x4" Painted','DFW','Other','Accessory','ABCSupply','ABC',11.75999999999999979,NULL,'2025-11-26T16:35:20.612Z',2);
INSERT INTO materials VALUES(211,'20"x50" Valley Metal','DFW','Other','Accessory','ABCSupply','ABC',51.84000000000000341,NULL,'2025-11-26T16:35:20.634Z',2);
INSERT INTO materials VALUES(212,'Counter Flashing 6" Mill','DFW','Other','Accessory','ABCSupply','ABC',20.30999999999999873,NULL,'2025-11-26T16:35:20.657Z',2);
INSERT INTO materials VALUES(213,'Galv J Flashing 4x4','DFW','Other','Accessory','ABCSupply','ABC',23.85000000000000142,NULL,'2025-11-26T16:35:20.680Z',2);
INSERT INTO materials VALUES(214,'Galv J Flashing 6x6','DFW','Other','Accessory','ABCSupply','ABC',31.4200000000000017,NULL,'2025-11-26T16:35:20.702Z',2);
INSERT INTO materials VALUES(215,'Tin Shingle 8x7 Mill','DFW','Other','Accessory','ABCSupply','ABC',49.39999999999999858,NULL,'2025-11-26T16:35:20.726Z',2);
INSERT INTO materials VALUES(216,'Tin Shingle 8x8 Mill','DFW','Other','Accessory','ABCSupply','ABC',66.20000000000000284,NULL,'2025-11-26T16:35:20.749Z',2);
INSERT INTO materials VALUES(217,'Selkirk 3" Base Flash','DFW','Other','Accessory','ABCSupply','ABC',9.52999999999999937,NULL,'2025-11-26T16:35:20.774Z',2);
INSERT INTO materials VALUES(218,'Selkirk 4" Base Flash','DFW','Other','Accessory','ABCSupply','ABC',13.22000000000000063,NULL,'2025-11-26T16:35:20.798Z',2);
INSERT INTO materials VALUES(219,'Paint','DFW','Other','Accessory','ABCSupply','ABC',7.0,NULL,'2025-11-26T16:35:20.822Z',2);
INSERT INTO materials VALUES(220,'2" Tin Caps Gold 50lb','DFW','Other','Accessory','ABCSupply','ABC',57.0,NULL,'2025-11-26T16:35:20.846Z',2);
INSERT INTO materials VALUES(221,'1" Plastic Caps','DFW','Other','Accessory','ABCSupply','ABC',14.75,NULL,'2025-11-26T16:35:20.870Z',2);
INSERT INTO materials VALUES(222,'1 1/4" Coil Nails','DFW','Other','Accessory','ABCSupply','ABC',35.25,NULL,'2025-11-26T16:35:20.893Z',2);
INSERT INTO materials VALUES(223,'1 1/4" Hand Nails','DFW','Other','Accessory','ABCSupply','ABC',68.98999999999999489,NULL,'2025-11-26T16:35:20.916Z',2);
INSERT INTO materials VALUES(224,'1/2" Lennar Decking Clips','DFW','Other','Accessory','ABCSupply','ABC',9.0,NULL,'2025-11-26T16:35:20.940Z',2);
INSERT INTO materials VALUES(225,'1/2" Decking Clips','DFW','Other','Accessory','ABCSupply','ABC',11.00999999999999979,NULL,'2025-11-26T16:35:20.964Z',2);
INSERT INTO materials VALUES(226,'Caulk - JTS','DFW','Other','Accessory','ABCSupply','ABC',6.75,NULL,'2025-11-26T16:35:20.986Z',2);
INSERT INTO materials VALUES(227,'3N1 Metal Base','DFW','Other','Accessory','ABCSupply','ABC',6.879999999999999894,NULL,'2025-11-26T16:35:21.009Z',2);
INSERT INTO materials VALUES(228,'Selkirk 3" Gas Cap','DFW','Other','Accessory','ABCSupply','ABC',7.080000000000000071,NULL,'2025-11-26T16:35:21.032Z',2);
INSERT INTO materials VALUES(229,'Selkirk 4" Gas Cap','DFW','Other','Accessory','ABCSupply','ABC',19.75,NULL,'2025-11-26T16:35:21.056Z',2);
INSERT INTO materials VALUES(230,'Selkirk 3" Collar','DFW','Other','Accessory','ABCSupply','ABC',2.560000000000000053,NULL,'2025-11-26T16:35:21.078Z',2);
INSERT INTO materials VALUES(231,'Selkirk 4" Collar','DFW','Other','Accessory','ABCSupply','ABC',4.410000000000000142,NULL,'2025-11-26T16:35:21.102Z',2);
INSERT INTO materials VALUES(232,'Rain Collar 1-3','DFW','Other','Accessory','ABCSupply','ABC',4.950000000000000177,NULL,'2025-11-26T16:35:21.124Z',2);
INSERT INTO materials VALUES(233,'IPS Plastic 1-3','DFW','Other','Accessory','ABCSupply','ABC',4.950000000000000177,NULL,'2025-11-26T16:35:21.147Z',2);
INSERT INTO materials VALUES(234,'Lead Flashing 1.5"','DFW','Other','Accessory','ABCSupply','ABC',21.32999999999999829,NULL,'2025-11-26T16:35:21.169Z',2);
INSERT INTO materials VALUES(235,'Lead Flashing 2"','DFW','Other','Accessory','ABCSupply','ABC',22.46000000000000085,NULL,'2025-11-26T16:35:21.192Z',2);
INSERT INTO materials VALUES(236,'Lead Flashing 3"','DFW','Other','Accessory','ABCSupply','ABC',30.94999999999999929,NULL,'2025-11-26T16:35:21.214Z',2);
INSERT INTO materials VALUES(237,'Lead Flashing 4"','DFW','Other','Accessory','ABCSupply','ABC',36.34000000000000342,NULL,'2025-11-26T16:35:21.236Z',2);
INSERT INTO materials VALUES(238,'6" Roof Jack Painted ADJ','DFW','Other','Accessory','ABCSupply','ABC',45.09000000000000342,NULL,'2025-11-26T16:35:21.258Z',2);
INSERT INTO materials VALUES(239,'8" Roof Jack Painted ADJ','DFW','Other','Accessory','ABCSupply','ABC',51.46000000000000085,NULL,'2025-11-26T16:35:21.281Z',2);
INSERT INTO materials VALUES(240,'Broan Roof Cap w/Damp 4"','DFW','Other','Accessory','ABCSupply','ABC',21.05999999999999873,NULL,'2025-11-26T16:35:21.304Z',2);
INSERT INTO materials VALUES(241,'Broan Roof Cap w/Damp 6"','DFW','Other','Accessory','ABCSupply','ABC',55.53999999999999915,NULL,'2025-11-26T16:35:21.327Z',2);
INSERT INTO materials VALUES(242,'Roof Anchor','DFW','Other','Accessory','ABCSupply','ABC',25.0,NULL,'2025-11-26T16:35:21.350Z',2);
INSERT INTO materials VALUES(243,'MFM Deck Tape','DFW','Other','Accessory','ABCSupply','ABC',22.0,NULL,'2025-11-26T16:35:21.374Z',2);
INSERT INTO materials VALUES(244,'Zip Tape 3-3/4"x90"','DFW','Other','Accessory','ABCSupply','ABC',34.03999999999999915,NULL,'2025-11-26T16:35:21.396Z',2);
INSERT INTO materials VALUES(245,'26G 4x10 Galv Metal Sheet','DFW','Other','Accessory','ABCSupply','ABC',43.22999999999999687,NULL,'2025-11-26T16:35:21.420Z',2);
INSERT INTO materials VALUES(246,'CT Landmark AR','DFW','CertainTeed','Shingle','ABCSupply','ABC',93.5,NULL,'2025-11-26T21:22:33.922Z',2);
INSERT INTO materials VALUES(247,'CT AR Xt25','DFW','CertainTeed','Shingle','ABCSupply','ABC',87.5,NULL,'2025-11-26T21:22:33.966Z',2);
INSERT INTO materials VALUES(248,'CT Patriot','DFW','CertainTeed','Shingle','ABCSupply','ABC',89.5,NULL,'2025-11-26T21:22:33.999Z',2);
INSERT INTO materials VALUES(249,'GAF Roy Sov','DFW','GAF','Shingle','ABCSupply','ABC',96.9800000000000039,NULL,'2025-11-26T21:22:34.038Z',2);
INSERT INTO materials VALUES(250,'GAF NS','DFW','GAF','Shingle','ABCSupply','ABC',87.03000000000000113,NULL,'2025-11-26T21:22:34.071Z',2);
INSERT INTO materials VALUES(251,'GAF HDZ','DFW','GAF','Shingle','ABCSupply','ABC',112.0,NULL,'2025-11-26T21:22:34.105Z',2);
INSERT INTO materials VALUES(252,'OC Supreme','DFW','Owens Corning','Shingle','ABCSupply','ABC',76.5,NULL,'2025-11-26T21:22:34.139Z',2);
INSERT INTO materials VALUES(253,'OC Oakridge','DFW','Owens Corning','Shingle','ABCSupply','ABC',100.0,NULL,'2025-11-26T21:22:34.172Z',2);
INSERT INTO materials VALUES(254,'OC Oakridge TruDef','DFW','Owens Corning','Shingle','ABCSupply','ABC',106.0199999999999961,NULL,'2025-11-26T21:22:34.206Z',2);
INSERT INTO materials VALUES(255,'OC Duration','DFW','Owens Corning','Shingle','ABCSupply','ABC',117.0,NULL,'2025-11-26T21:22:34.241Z',2);
INSERT INTO materials VALUES(256,'TAMKO Elite','DFW','Tamko','Shingle','ABCSupply','ABC',82.65000000000000569,NULL,'2025-11-26T21:22:34.287Z',2);
INSERT INTO materials VALUES(257,'TAMKO Heritage','DFW','Tamko','Shingle','ABCSupply','ABC',90.29999999999999716,NULL,'2025-11-26T21:22:34.321Z',2);
INSERT INTO materials VALUES(258,'IKO Marathon','DFW','IKO','Shingle','ABCSupply','ABC',86.5,NULL,'2025-11-26T21:22:34.354Z',2);
INSERT INTO materials VALUES(259,'IKO Cambridge','DFW','IKO','Shingle','ABCSupply','ABC',86.0,NULL,'2025-11-26T21:22:34.387Z',2);
INSERT INTO materials VALUES(260,'Atlas ProLam','DFW','Atlas','Shingle','ABCSupply','ABC',78.25,NULL,'2025-11-26T21:22:34.420Z',2);
INSERT INTO materials VALUES(261,'Atlas Pinnacle','DFW','Atlas','Shingle','ABCSupply','ABC',104.0100000000000051,NULL,'2025-11-26T21:22:34.454Z',2);
INSERT INTO materials VALUES(262,'Tamko 10" Starter (110LF)','DFW','Tamko','Accessory','ABCSupply','ABC',45.0,NULL,'2025-11-26T21:22:34.488Z',2);
INSERT INTO materials VALUES(263,'GAF Pro Starter (120 LF/BD)','DFW','GAF','Accessory','ABCSupply','ABC',41.0,NULL,'2025-11-26T21:22:34.521Z',2);
INSERT INTO materials VALUES(264,'OC Starter (100LF)','DFW','Owens Corning','Accessory','ABCSupply','ABC',41.0,NULL,'2025-11-26T21:22:34.553Z',2);
INSERT INTO materials VALUES(265,'Atlas Pro-Cut Starter (140LF)','DFW','Atlas','Accessory','ABCSupply','ABC',86.75,NULL,'2025-11-26T21:22:34.586Z',2);
INSERT INTO materials VALUES(266,'CT Swiftstart (116 LF)','DFW','CertainTeed','Accessory','ABCSupply','ABC',55.0,NULL,'2025-11-26T21:22:34.619Z',2);
INSERT INTO materials VALUES(267,'15# Felt','DFW','Other','Underlayment','ABCSupply','ABC',22.5,NULL,'2025-11-26T21:22:34.653Z',2);
INSERT INTO materials VALUES(268,'30# Felt','DFW','Other','Underlayment','ABCSupply','ABC',22.5,NULL,'2025-11-26T21:22:34.686Z',2);
INSERT INTO materials VALUES(269,'GAP Valley Flash','DFW','Other','Underlayment','ABCSupply','ABC',31.60000000000000142,NULL,'2025-11-26T21:22:34.719Z',2);
INSERT INTO materials VALUES(270,'Tarco Leakbarrier Valley Flash 1','DFW','Other','Underlayment','ABCSupply','ABC',27.0,NULL,'2025-11-26T21:22:34.753Z',2);
INSERT INTO materials VALUES(271,'GAF Stormguard I/W','DFW','GAF','Underlayment','ABCSupply','ABC',102.0,NULL,'2025-11-26T21:22:34.787Z',2);
INSERT INTO materials VALUES(272,'GAP Waterguard I/W','DFW','Other','Underlayment','ABCSupply','ABC',55.95000000000000284,NULL,'2025-11-26T21:22:34.820Z',2);
INSERT INTO materials VALUES(273,'Rhino G I/W','DFW','Other','Underlayment','ABCSupply','ABC',58.0,NULL,'2025-11-26T21:22:34.853Z',2);
INSERT INTO materials VALUES(274,'Resisto Underlay 3''x65'' I/W','DFW','Other','Underlayment','ABCSupply','ABC',55.95000000000000284,NULL,'2025-11-26T21:22:34.887Z',2);
INSERT INTO materials VALUES(275,'Tarco MS300 Ice & Water','DFW','Other','Underlayment','ABCSupply','ABC',55.95000000000000284,NULL,'2025-11-26T21:22:34.920Z',2);
INSERT INTO materials VALUES(276,'Technoply 48" x 250''','DFW','Other','Underlayment','ABCSupply','ABC',50.0,NULL,'2025-11-26T21:22:34.953Z',2);
INSERT INTO materials VALUES(277,'MaxFelt XT 10 SQ','DFW','Other','Underlayment','ABCSupply','ABC',50.0,NULL,'2025-11-26T21:22:34.986Z',2);
INSERT INTO materials VALUES(278,'MaxFelt 30 Synthetic','DFW','Other','Underlayment','ABCSupply','ABC',112.3199999999999931,NULL,'2025-11-26T21:22:35.019Z',2);
INSERT INTO materials VALUES(279,'CMAC MaxFelt XT 10 SQ','DFW','Other','Underlayment','ABCSupply','ABC',56.5,NULL,'2025-11-26T21:22:35.053Z',2);
INSERT INTO materials VALUES(280,'CMAC MaxFelt 15 (5SQ)','DFW','Other','Underlayment','ABCSupply','ABC',24.0,NULL,'2025-11-26T21:22:35.087Z',2);
INSERT INTO materials VALUES(281,'CMAC MaxFelt 15 (10SQ)','DFW','Other','Underlayment','ABCSupply','ABC',48.0,NULL,'2025-11-26T21:22:35.120Z',2);
INSERT INTO materials VALUES(282,'CONT Securegrip 30 4''x250''','DFW','Other','Underlayment','ABCSupply','ABC',45.0,NULL,'2025-11-26T21:22:35.154Z',2);
INSERT INTO materials VALUES(283,'CONT Xtreme WthrWarr 10 SQ','DFW','Other','Underlayment','ABCSupply','ABC',44.0,NULL,'2025-11-26T21:22:35.187Z',2);
INSERT INTO materials VALUES(284,'CONT Xtreme WthrWarr 5 SQ','DFW','Other','Underlayment','ABCSupply','ABC',23.0,NULL,'2025-11-26T21:22:35.219Z',2);
INSERT INTO materials VALUES(285,'CoverPro 1000 10 SQ','DFW','Other','Underlayment','ABCSupply','ABC',44.0,NULL,'2025-11-26T21:22:35.252Z',2);
INSERT INTO materials VALUES(286,'CoverPro 1000 5 SQ','DFW','Other','Underlayment','ABCSupply','ABC',23.0,NULL,'2025-11-26T21:22:35.287Z',2);
INSERT INTO materials VALUES(287,'Certainteed Roof Runner','DFW','Other','Underlayment','ABCSupply','ABC',115.2300000000000039,NULL,'2025-11-26T21:22:35.321Z',2);
INSERT INTO materials VALUES(288,'ABC ProGuard','DFW','Other','Underlayment','ABCSupply','ABC',52.9200000000000017,NULL,'2025-11-26T21:22:35.354Z',2);
INSERT INTO materials VALUES(289,'OC Rhino UDL Synthetic','DFW','Owens Corning','Underlayment','ABCSupply','ABC',60.0,NULL,'2025-11-26T21:22:35.387Z',2);
INSERT INTO materials VALUES(290,'OC WeatherLoc','DFW','Owens Corning','Underlayment','ABCSupply','ABC',122.7900000000000062,NULL,'2025-11-26T21:22:35.420Z',2);
INSERT INTO materials VALUES(291,'GAF StormGuard','DFW','GAF','Underlayment','ABCSupply','ABC',106.7999999999999972,NULL,'2025-11-26T21:22:35.453Z',2);
INSERT INTO materials VALUES(292,'CT Landmark AR','DFW','CertainTeed','Shingle','SRSProducts','SRS',87.25,NULL,'2025-11-26T21:22:35.489Z',2);
INSERT INTO materials VALUES(293,'CT AR Xt25','DFW','CertainTeed','Shingle','SRSProducts','SRS',79.48000000000000397,NULL,'2025-11-26T21:22:35.522Z',2);
INSERT INTO materials VALUES(294,'CT Patriot','DFW','CertainTeed','Shingle','SRSProducts','SRS',98.0,NULL,'2025-11-26T21:22:35.555Z',2);
INSERT INTO materials VALUES(295,'GAF Roy Sov','DFW','GAF','Shingle','SRSProducts','SRS',90.0,NULL,'2025-11-26T21:22:35.588Z',2);
INSERT INTO materials VALUES(296,'GAF NS','DFW','GAF','Shingle','SRSProducts','SRS',97.25,NULL,'2025-11-26T21:22:35.621Z',2);
INSERT INTO materials VALUES(297,'GAF HDZ','DFW','GAF','Shingle','SRSProducts','SRS',126.0,NULL,'2025-11-26T21:22:35.654Z',2);
INSERT INTO materials VALUES(298,'OC Supreme','DFW','Owens Corning','Shingle','SRSProducts','SRS',84.98999999999999489,NULL,'2025-11-26T21:22:35.687Z',2);
INSERT INTO materials VALUES(299,'OC Oakridge','DFW','Owens Corning','Shingle','SRSProducts','SRS',116.0,NULL,'2025-11-26T21:22:35.721Z',2);
INSERT INTO materials VALUES(300,'OC Oakridge TruDef','DFW','Owens Corning','Shingle','SRSProducts','SRS',118.0,NULL,'2025-11-26T21:22:35.753Z',2);
INSERT INTO materials VALUES(301,'OC Duration','DFW','Owens Corning','Shingle','SRSProducts','SRS',132.0,NULL,'2025-11-26T21:22:35.786Z',2);
INSERT INTO materials VALUES(302,'TAMKO Elite','DFW','Tamko','Shingle','SRSProducts','SRS',80.15000000000000569,NULL,'2025-11-26T21:22:35.819Z',2);
INSERT INTO materials VALUES(303,'TAMKO Heritage','DFW','Tamko','Shingle','SRSProducts','SRS',90.03000000000000113,NULL,'2025-11-26T21:22:35.852Z',2);
INSERT INTO materials VALUES(304,'IKO Marathon','DFW','IKO','Shingle','SRSProducts','SRS',83.12999999999999546,NULL,'2025-11-26T21:22:35.884Z',2);
INSERT INTO materials VALUES(305,'IKO Cambridge','DFW','IKO','Shingle','SRSProducts','SRS',84.5,NULL,'2025-11-26T21:22:35.918Z',2);
INSERT INTO materials VALUES(306,'Atlas ProLam','DFW','Atlas','Shingle','SRSProducts','SRS',87.0,NULL,'2025-11-26T21:22:35.950Z',2);
INSERT INTO materials VALUES(307,'Atlas Pinnacle','DFW','Atlas','Shingle','SRSProducts','SRS',104.0,NULL,'2025-11-26T21:22:35.983Z',2);
INSERT INTO materials VALUES(308,'Atlas Procut Hip and Ridge','DFW','Atlas','Shingle','SRSProducts','SRS',80.0,NULL,'2025-11-26T21:22:36.016Z',2);
INSERT INTO materials VALUES(309,'Tamko 10" Starter (110LF)','DFW','Tamko','Accessory','SRSProducts','SRS',84.25,NULL,'2025-11-26T21:22:36.049Z',2);
INSERT INTO materials VALUES(310,'GAF Pro Starter (120 LF/BD)','DFW','GAF','Accessory','SRSProducts','SRS',67.0,NULL,'2025-11-26T21:22:36.082Z',2);
INSERT INTO materials VALUES(311,'OC Starter (100LF)','DFW','Owens Corning','Accessory','SRSProducts','SRS',74.0,NULL,'2025-11-26T21:22:36.116Z',2);
INSERT INTO materials VALUES(312,'Atlas Pro-Cut Starter (140LF)','DFW','Atlas','Accessory','SRSProducts','SRS',104.0,NULL,'2025-11-26T21:22:36.148Z',2);
INSERT INTO materials VALUES(313,'CT Swiftstart (116 LF)','DFW','CertainTeed','Accessory','SRSProducts','SRS',64.0,NULL,'2025-11-26T21:22:36.182Z',2);
INSERT INTO materials VALUES(314,'Topshield Starter','DFW','Other','Accessory','SRSProducts','SRS',37.0,NULL,'2025-11-26T21:22:36.215Z',2);
INSERT INTO materials VALUES(315,'IKO Starter (123 LF)','DFW','IKO','Accessory','SRSProducts','SRS',67.25,NULL,'2025-11-26T21:22:36.248Z',2);
INSERT INTO materials VALUES(316,'IKO Edgeseal Roof Starter (8-3/4" X 67.3'')','DFW','IKO','Accessory','SRSProducts','SRS',122.0,NULL,'2025-11-26T21:22:36.280Z',2);
INSERT INTO materials VALUES(317,'15# Felt','DFW','Other','Accessory','SRSProducts','SRS',21.75,NULL,'2025-11-26T21:22:36.313Z',2);
INSERT INTO materials VALUES(318,'30# Felt','DFW','Other','Accessory','SRSProducts','SRS',21.75,NULL,'2025-11-26T21:22:36.345Z',2);
INSERT INTO materials VALUES(319,'MSA valley flash','DFW','Other','Accessory','SRSProducts','SRS',29.85000000000000142,NULL,'2025-11-26T21:22:36.378Z',2);
INSERT INTO materials VALUES(320,'GAF Stormguard I/W','DFW','GAF','Underlayment','SRSProducts','SRS',127.0,NULL,'2025-11-26T21:22:36.411Z',2);
INSERT INTO materials VALUES(321,'Rhino G I/W','DFW','Other','Underlayment','SRSProducts','SRS',118.0,NULL,'2025-11-26T21:22:36.444Z',2);
INSERT INTO materials VALUES(322,'Resisto Defender Underlay 3''x65'' I/W','DFW','Other','Underlayment','SRSProducts','SRS',56.20000000000000284,NULL,'2025-11-26T21:22:36.476Z',2);
INSERT INTO materials VALUES(323,'Tarco MS300 Ice & Water','DFW','Other','Underlayment','SRSProducts','SRS',56.20000000000000284,NULL,'2025-11-26T21:22:36.509Z',2);
INSERT INTO materials VALUES(324,'Technoply 48" x 250''','DFW','Other','Underlayment','SRSProducts','SRS',51.0,NULL,'2025-11-26T21:22:36.541Z',2);
INSERT INTO materials VALUES(325,'CMAC MaxFelt 15 (5SQ)','DFW','Other','Underlayment','SRSProducts','SRS',28.64999999999999858,NULL,'2025-11-26T21:22:36.574Z',2);
INSERT INTO materials VALUES(326,'CMAC MaxFelt 15 (10SQ)','DFW','Other','Underlayment','SRSProducts','SRS',55.64999999999999858,NULL,'2025-11-26T21:22:36.607Z',2);
INSERT INTO materials VALUES(327,'CoverPro 1000 10 SQ','DFW','Other','Underlayment','SRSProducts','SRS',55.0,NULL,'2025-11-26T21:22:36.641Z',2);
INSERT INTO materials VALUES(328,'Certainteed Roof Runner','DFW','Other','Underlayment','SRSProducts','SRS',118.0,NULL,'2025-11-26T21:22:36.673Z',2);
INSERT INTO materials VALUES(329,'topshield synthetic (10sq)','DFW','Other','Underlayment','SRSProducts','SRS',55.64999999999999858,NULL,'2025-11-26T21:22:36.707Z',2);
INSERT INTO materials VALUES(330,'OC Rhino UDL Synthetic','DFW','Owens Corning','Underlayment','SRSProducts','SRS',94.5,NULL,'2025-11-26T21:22:36.739Z',2);
INSERT INTO materials VALUES(331,'OC WeatherLoc','DFW','Owens Corning','Underlayment','SRSProducts','SRS',113.0,NULL,'2025-11-26T21:22:36.773Z',2);
INSERT INTO materials VALUES(332,'GAF StormGuard','DFW','GAF','Underlayment','SRSProducts','SRS',127.0,NULL,'2025-11-26T21:22:36.807Z',2);
INSERT INTO sqlite_sequence VALUES('roles',8);
INSERT INTO sqlite_sequence VALUES('employees',140);
INSERT INTO sqlite_sequence VALUES('builders',85);
INSERT INTO sqlite_sequence VALUES('communities',628);
INSERT INTO sqlite_sequence VALUES('acculynx_workflow_milestones',30);
INSERT INTO sqlite_sequence VALUES('acculynx_jobs',4);
INSERT INTO sqlite_sequence VALUES('acculynx_contacts',25);
CREATE TRIGGER update_acculynx_contacts_timestamp 
    AFTER UPDATE ON acculynx_contacts
    BEGIN
        UPDATE acculynx_contacts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
CREATE TRIGGER update_acculynx_jobs_timestamp 
    AFTER UPDATE ON acculynx_jobs
    BEGIN
        UPDATE acculynx_jobs SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
CREATE INDEX idx_builders_name ON builders(name);
CREATE INDEX idx_employees_name ON employees(full_name);
CREATE INDEX idx_assignments_b ON assignments(builder_id);
CREATE INDEX idx_communities_b ON communities(builder_id);
CREATE INDEX idx_acculynx_jobs_milestone ON acculynx_jobs(milestone);
CREATE INDEX idx_acculynx_jobs_status ON acculynx_jobs(status);
CREATE INDEX idx_acculynx_jobs_contact ON acculynx_jobs(contact_id);
CREATE INDEX idx_acculynx_jobs_modified ON acculynx_jobs(modified_date);
CREATE INDEX idx_acculynx_jobs_synced ON acculynx_jobs(last_synced_at);
CREATE INDEX idx_acculynx_contacts_email ON acculynx_contacts(email);
CREATE INDEX idx_acculynx_contacts_phone ON acculynx_contacts(phone);
COMMIT;
