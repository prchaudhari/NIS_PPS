﻿CREATE TABLE [NIS].[TenantEntity] (
    [Id]            BIGINT         IDENTITY (1, 1) NOT NULL,
    [Name]          NVARCHAR (100) NOT NULL,
    [Description]   NVARCHAR (500) NOT NULL,
    [CreatedOn]     DATETIME       NOT NULL,
    [CreatedBy]     BIGINT         NOT NULL,
    [LastUpdatedOn] DATETIME       NOT NULL,
    [LastUpdatedBy] BIGINT         NOT NULL,
    [IsActive]      BIT            NOT NULL,
    [IsDeleted]     BIT            NOT NULL,
    [TenantCode]    NVARCHAR (50)  NOT NULL,
    [APIPath]       NVARCHAR (100) NOT NULL,
    [RequestType]   NVARCHAR (50)  NOT NULL,
    CONSTRAINT [PK__Entity__3214EC0726944DFF] PRIMARY KEY CLUSTERED ([Id] ASC)
);

