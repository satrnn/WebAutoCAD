CREATE TABLE `projects` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Content` varchar(5000) NOT NULL,
  `AddDate` datetime NOT NULL,
  `LastUpdate` datetime NOT NULL,
  `IsDeleted` tinyint(4) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;