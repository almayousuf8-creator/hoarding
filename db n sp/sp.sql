DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_CreateHoarding`(
        IN p_location_id INT,
        IN p_name VARCHAR(255),
        IN p_description TEXT,
        IN p_availability_status VARCHAR(50),
        IN p_occupied_till DATE,
        IN p_amount DECIMAL(10,2),
        IN p_latitude DECIMAL(10,8),
        IN p_longitude DECIMAL(11,8),
        IN p_google_maps_url TEXT,
        IN p_status VARCHAR(50)
      )
BEGIN
        INSERT INTO hoardings (
          location_id, name, description, availability_status, occupied_till, 
          amount, latitude, longitude, google_maps_url, status
        ) VALUES (
          p_location_id, p_name, p_description, p_availability_status, p_occupied_till, 
          p_amount, p_latitude, p_longitude, p_google_maps_url, p_status
        );
        SELECT LAST_INSERT_ID() as insertId;
      END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_DeleteHoarding`(IN p_id INT)
BEGIN
        DELETE FROM hoardings WHERE id = p_id;
        SELECT ROW_COUNT() as affectedRows;
      END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_UpdateHoarding`(
        IN p_id INT,
        IN p_location_id INT,
        IN p_name VARCHAR(255),
        IN p_description TEXT,
        IN p_availability_status VARCHAR(50),
        IN p_occupied_till DATE,
        IN p_amount DECIMAL(10,2),
        IN p_latitude DECIMAL(10,8),
        IN p_longitude DECIMAL(11,8),
        IN p_google_maps_url TEXT,
        IN p_status VARCHAR(50)
      )
BEGIN
        UPDATE hoardings 
        SET 
          location_id = p_location_id,
          name = p_name,
          description = p_description,
          availability_status = p_availability_status,
          occupied_till = p_occupied_till,
          amount = p_amount,
          latitude = p_latitude,
          longitude = p_longitude,
          google_maps_url = p_google_maps_url,
          status = p_status
        WHERE id = p_id;
        
        SELECT ROW_COUNT() as affectedRows;
      END$$
DELIMITER ;
