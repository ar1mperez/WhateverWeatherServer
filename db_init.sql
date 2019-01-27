drop table Clothes;
drop table Configuration;
drop table `Types`;

-- Type of clothing
CREATE TABLE `Types` (
	ID int NOT NULL auto_increment,
    `Name` nvarchar(50),
    PRIMARY KEY(ID)
);

-- Specific clothings articles
-- Tops has 3 layers: undershirt (tanks, t-shirts), overshirt(sweater, cardigans, zip-up, hoodie), jacket/coat
-- Bottom has 3 layers: leggings, pants, snowpants
-- TempInc refers to the DeltaTemp value
CREATE TABLE Clothes (
	ID int NOT NULL auto_increment,
    `Name` nvarchar(50),
    TempInc int,
    TypeID int,
    PRIMARY KEY(ID),
    FOREIGN KEY(TypeID) REFERENCES `Types` (ID)
);

-- Settings configuration, does not have relationships with the other tables
-- Config names include city, country, ideal temperature
CREATE TABLE Configuration (
	ID int NOT NULL auto_increment,
    `Name` nvarchar(50),
    `Value` nvarchar(50),
    PRIMARY KEY(ID)
);


-- VALUES
-- Types of clothings
INSERT INTO `Types` VALUES(1, 'Undershirt');
INSERT INTO `Types` VALUES(2, 'Overshirt');
INSERT INTO `Types` VALUES(3, 'Coat');
INSERT INTO `Types` VALUES(4, 'Leggings');
INSERT INTO `Types` VALUES(5, 'Bottom');
INSERT INTO `Types` VALUES(6, 'Overpants');

-- Undershirts 0.5 - 3
INSERT INTO Clothes VALUES(10, 'Tank Top', 50, 1);
INSERT INTO Clothes VALUES(11, 'T-Shirt', 200, 1);

-- Overshirts 3.5 - 6
INSERT INTO Clothes VALUES(20, 'Sweater', 500, 2);
INSERT INTO Clothes VALUES(21, 'Cardigan', 350, 2);
INSERT INTO Clothes VALUES(22, 'Zip-Up Sweatshirt', 450, 2);
INSERT INTO Clothes VALUES(23, 'Hoodie', 500, 2);

-- Coats/Jackets 6.5 - 11 +
INSERT INTO Clothes VALUES(30, 'Leather Jacket', 650, 3);
INSERT INTO Clothes VALUES(31, 'Winter Coat', 1100, 3);

-- Leggings 
INSERT INTO Clothes VALUES(40, 'Cotton Leggings', 250, 4);

-- Bottoms
INSERT INTO Clothes VALUES(50, 'Shorts', 350, 5);
INSERT INTO Clothes VALUES(51, 'Trousers', 400, 5);
INSERT INTO Clothes VALUES(52, 'Jeans', 500, 5);

-- Overpants
INSERT INTO Clothes VALUES(60, 'Snowpants', 1100, 6);

-- Configs
INSERT INTO Configuration VALUES(1, 'City', 'Montreal');
INSERT INTO Configuration VALUES(2, 'Country', 'CA');
INSERT INTO Configuration VALUES(3, 'Ideal Temperature', '21');

SELECT * from Clothes;
SELECT * from `Types`;
	

