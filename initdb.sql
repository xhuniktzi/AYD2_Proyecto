INSERT INTO public.config_control ("name",value) VALUES
	 ('user-active','1'),
	 ('user-not-checkin','2'),
	 ('trip-pending','1'),
	 ('trip-canceled','2'),
	 ('trip-indrive','3'),
	 ('trip-complete','4'),	 
	 ('report-open','1');

INSERT INTO public.gender ("name",abreviature) VALUES
	 ('null','N'),
	 ('female','F'),
	 ('male','M');

INSERT INTO public.user_state ("name") VALUES
	 ('active'),
	 ('not-checkin');

INSERT INTO public.driver_state ("name") VALUES
	 ('active'),
	 ('not-checkin');

INSERT INTO public.marital_status ("name") VALUES
	('soltero'),
	('casado');

INSERT INTO public.trip_state ("name") VALUES
('pending'),
('canceled'),
('indrive'),
('complete');

INSERT INTO public.report_state ("name") VALUES
('open'),
('close');

INSERT INTO tarifa ("origin", "destination", "price") VALUES
('Zona 1', 'Zona 2', 10.00),
('Zona 1', 'Zona 3', 15.00),
('Zona 1', 'Zona 4', 20.00),
('Zona 1', 'Zona 5', 20.00),
('Zona 1', 'Zona 6', 25.00),
('Zona 1', 'Zona 7', 30.00),
('Zona 1', 'Zona 8', 30.00),
('Zona 1', 'Zona 9', 40.00),
('Zona 1', 'Zona 10', 50.00),
('Zona 1', 'Zona 11', 50.00),
('Zona 1', 'Zona 12', 25.00),
('Zona 2', 'Zona 3', 25.00),
('Zona 2', 'Zona 4', 25.00),
('Zona 2', 'Zona 5', 25.00),
('Zona 2', 'Zona 6', 30.00),
('Zona 2', 'Zona 7', 40.00),
('Zona 2', 'Zona 8', 40.00),
('Zona 2', 'Zona 9', 60.00),
('Zona 2', 'Zona 10', 70.00),
('Zona 2', 'Zona 11', 50.00),
('Zona 2', 'Zona 12', 35.00),
('Zona 3', 'Zona 4', 20.00),
('Zona 3', 'Zona 5', 30.00),
('Zona 3', 'Zona 6', 35.00),
('Zona 3', 'Zona 7', 25.00),
('Zona 3', 'Zona 8', 25.00),
('Zona 3', 'Zona 9', 40.00),
('Zona 3', 'Zona 10', 45.00),
('Zona 3', 'Zona 11', 40.00),
('Zona 3', 'Zona 12', 30.00),
('Zona 4', 'Zona 5', 15.00),
('Zona 4', 'Zona 6', 25.00),
('Zona 4', 'Zona 7', 25.00),
('Zona 4', 'Zona 8', 25.00),
('Zona 4', 'Zona 9', 15.00),
('Zona 4', 'Zona 10', 30.00),
('Zona 4', 'Zona 11', 35.00),
('Zona 4', 'Zona 12', 35.00),
('Zona 5', 'Zona 6', 15.00),
('Zona 5', 'Zona 7', 25.00),
('Zona 5', 'Zona 8', 35.00),
('Zona 5', 'Zona 9', 25.00),
('Zona 5', 'Zona 10', 35.00),
('Zona 5', 'Zona 11', 40.00),
('Zona 5', 'Zona 12', 40.00),
('Zona 6', 'Zona 7', 30.00),
('Zona 6', 'Zona 8', 35.00),
('Zona 6', 'Zona 9', 40.00),
('Zona 6', 'Zona 10', 50.00),
('Zona 6', 'Zona 11', 65.00),
('Zona 6', 'Zona 12', 60.00),
('Zona 7', 'Zona 8', 25.00),
('Zona 7', 'Zona 9', 35.00),
('Zona 7', 'Zona 10', 40.00),
('Zona 7', 'Zona 11', 40.00),
('Zona 7', 'Zona 12', 40.00),
('Zona 8', 'Zona 9', 25.00),
('Zona 8', 'Zona 10', 35.00),
('Zona 8', 'Zona 11', 35.00),
('Zona 8', 'Zona 12', 35.00),
('Zona 9', 'Zona 10', 15.00),
('Zona 9', 'Zona 11', 35.00),
('Zona 9', 'Zona 12', 30.00),
('Zona 10', 'Zona 11', 50.00),
('Zona 10', 'Zona 12', 50.00),
('Zona 11', 'Zona 12', 50.00);
