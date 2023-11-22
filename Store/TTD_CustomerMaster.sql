﻿CREATE TABLE [NIS].[TTD_CustomerMaster]
(
	Id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[BatchId] BIGINT NOT NULL,
	[CustomerCode] NVARCHAR(50) NOT NULL,
	[FirstName] NVARCHAR(100) NOT NULL,
	[MiddleName] NVARCHAR(100) NULL,
	[LastName] NVARCHAR(500) NOT NULL,
	[AddressLine1] NVARCHAR(500) NOT NULL,
	[AddressLine2] NVARCHAR(500) NULL,
	[City] NVARCHAR(50) NULL,
	[State] NVARCHAR(50) NULL,
	[Country] NVARCHAR(50) NULL,
	[Zip] NVARCHAR(10) NULL,
	[StatementDate] DATETIME NULL,
	[StatementPeriod] NVARCHAR(50) NULL,
	[TenantCode] NVARCHAR(50) NOT NULL
)
