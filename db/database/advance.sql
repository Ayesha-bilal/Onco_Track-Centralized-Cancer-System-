-- =====================================================
-- ONCOTRACK ADVANCED DATABASE FEATURES
-- PostgreSQL
-- =====================================================



-- =====================================================
-- 1. INDEXES
-- Improve searching performance
-- =====================================================


CREATE INDEX IF NOT EXISTS idx_patient_name
ON patients(name);


CREATE INDEX IF NOT EXISTS idx_patient_cnic
ON patients(cnic);


CREATE INDEX IF NOT EXISTS idx_doctor_name
ON doctors(doctor_name);


CREATE INDEX IF NOT EXISTS idx_hospital_city
ON hospitals(city);


CREATE INDEX IF NOT EXISTS idx_diagnosis_cancer
ON diagnosis(cancer_type);


CREATE INDEX IF NOT EXISTS idx_treatment_status
ON treatments(status);





-- =====================================================
-- 2. CREATE ALERT TABLE
-- Used by triggers
-- =====================================================


CREATE TABLE IF NOT EXISTS alerts(

alert_id SERIAL PRIMARY KEY,

patient_id INT,

message VARCHAR(255),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

status VARCHAR(50)

);







-- =====================================================
-- 3. STORED FUNCTION
-- Add patient record
-- =====================================================


CREATE OR REPLACE FUNCTION add_patient_record(

p_cnic VARCHAR,

p_name VARCHAR,

p_dob DATE,

p_gender VARCHAR,

p_city VARCHAR,

p_province VARCHAR,

p_phone VARCHAR,

p_blood VARCHAR


)

RETURNS VOID

AS $$


BEGIN


INSERT INTO patients

(
cnic,
name,
dob,
gender,
city,
province,
phone,
blood_group
)


VALUES

(
p_cnic,
p_name,
p_dob,
p_gender,
p_city,
p_province,
p_phone,
p_blood
);



END;


$$ LANGUAGE plpgsql;







-- =====================================================
-- 4. FUNCTION FOR DASHBOARD
-- Total patients
-- =====================================================


CREATE OR REPLACE FUNCTION total_patients()

RETURNS INTEGER

AS $$


DECLARE

total INTEGER;


BEGIN


SELECT COUNT(*)

INTO total

FROM patients;



RETURN total;



END;


$$ LANGUAGE plpgsql;







-- =====================================================
-- 5. FUNCTION
-- Patient complete history count
-- =====================================================


CREATE OR REPLACE FUNCTION patient_history_count(

p_id INT

)

RETURNS TABLE(

diagnosis_total INT,

treatment_total INT

)


AS $$


BEGIN


RETURN QUERY


SELECT

COUNT(DISTINCT d.diagnosis_id)::INT,

COUNT(DISTINCT t.treatment_id)::INT



FROM diagnosis d


LEFT JOIN treatments t

ON d.diagnosis_id=t.diagnosis_id


WHERE d.patient_id=p_id;



END;


$$ LANGUAGE plpgsql;








-- =====================================================
-- 6. STORED PROCEDURE
-- Update treatment status
-- =====================================================


CREATE OR REPLACE PROCEDURE update_treatment_status(

p_id INT,

p_status VARCHAR


)


LANGUAGE plpgsql


AS $$


BEGIN


UPDATE treatments


SET status=p_status


WHERE treatment_id=p_id;



END;


$$;








-- =====================================================
-- 7. TRIGGER FUNCTION
-- Automatically create alert
-- when diagnosis added
-- =====================================================


CREATE OR REPLACE FUNCTION diagnosis_alert_trigger()


RETURNS TRIGGER


AS $$


BEGIN



INSERT INTO alerts


(
patient_id,

message,

status

)


VALUES


(

NEW.patient_id,

'New cancer diagnosis added',

'Unread'

);



RETURN NEW;



END;


$$ LANGUAGE plpgsql;







-- =====================================================
-- 8. CREATE TRIGGER
-- =====================================================


DROP TRIGGER IF EXISTS new_diagnosis_alert

ON diagnosis;



CREATE TRIGGER new_diagnosis_alert


AFTER INSERT

ON diagnosis


FOR EACH ROW


EXECUTE FUNCTION diagnosis_alert_trigger();








-- =====================================================
-- 9. DATABASE VIEW
-- Complete patient medical history
-- =====================================================


CREATE OR REPLACE VIEW patient_full_history AS


SELECT


p.patient_id,

p.name,

p.cnic,

d.cancer_type,

d.cancer_stage,

d.affected_organ,

t.treatment_type,

t.status



FROM patients p


LEFT JOIN diagnosis d

ON p.patient_id=d.patient_id



LEFT JOIN treatments t

ON d.diagnosis_id=t.diagnosis_id;









-- =====================================================
-- 10. TRANSACTION EXAMPLE
-- Safe operation
-- =====================================================



BEGIN;



INSERT INTO alerts

(
patient_id,

message,

status

)


VALUES

(

1,

'Medical report generated',

'Unread'

);



COMMIT;

