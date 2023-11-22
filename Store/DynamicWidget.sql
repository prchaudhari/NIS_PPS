﻿CREATE TABLE [NIS].[DynamicWidget] (
    [Id]                   BIGINT         IDENTITY (1, 1) NOT NULL,
    [WidgetName]           NVARCHAR (100) NOT NULL,
    [WidgetType]           NVARCHAR (50)  NOT NULL,
    [PageTypeId]           BIGINT         NOT NULL,
    [EntityId]             BIGINT         NOT NULL,
    [Title]                NVARCHAR (100) NOT NULL,
    [ThemeType]            NVARCHAR (50)  NOT NULL,
    [ThemeCSS]             NVARCHAR (MAX) NULL,
    [WidgetSettings]       NVARCHAR (MAX) NULL,
    [WidgetFilterSettings] NVARCHAR (MAX) NULL,
    [Status]               NVARCHAR (50)  NOT NULL,
    [CreatedBy]            BIGINT         NOT NULL,
    [CreatedOn]            DATETIME       NOT NULL,
    [LastUpdatedBy]        BIGINT         NOT NULL,
    [PublishedBy]          BIGINT         NULL,
    [PublishedDate]        DATETIME       NULL,
    [IsActive]             BIT            NOT NULL,
    [IsDeleted]            BIT            NOT NULL,
    [TenantCode]           NVARCHAR (50)  NOT NULL,
    [CloneOfWidgetId]      BIGINT         NULL,
    [Version]              NVARCHAR (100) NULL,
    [PreviewData]          NVARCHAR (MAX) NOT NULL,
    [FilterCondition] NVARCHAR(MAX) NULL, 
    CONSTRAINT [PK__DynamicW__3214EC071888ACAB] PRIMARY KEY CLUSTERED ([Id] ASC)
);


