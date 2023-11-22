﻿CREATE VIEW [NIS].[View_DynamicWidget1]
AS

SELECT DISTINCT(s.Id) AS Id, MAX(s.WidgetName) AS WidgetName, MAX(s.WidgetType) AS WidgetType, s.EntityId,
MAX(s.Title) AS Title, MAX(s.ThemeType) AS ThemeType, MAX(s.ThemeCSS) AS ThemeCSS, MAX(s.WidgetSettings) AS WidgetSettings,
MAX(s.WidgetFilterSettings) AS WidgetFilterSettings, MAX(s.Status) AS Status, MAX(s.CreatedBy) AS CreatedBy, MAX(s.CreatedOn) AS CreatedOn,
s.LastUpdatedBy, s.PublishedBy, MAX(s.PublishedDate) AS PublishedDate, s.IsActive, s.IsDeleted,
MAX(s.TenantCode) AS TenantCode, s.CloneOfWidgetId, MAX(s.Version) As Version, 
MAX(s.PreviewData) AS PreviewData, usr1.FirstName+' '+usr1.LastName AS PublishedByName, usr2.FirstName+' '+usr2.LastName AS CreatedByName,
ent.Name AS EntityName, ent.APIPath, ent.RequestType, wpt.PageTypeId
FROM [NIS].[DynamicWidget] s 
LEFT JOIN [NIS].[User] usr1 ON s.PublishedBy = usr1.Id
INNER JOIN [NIS].[User] usr2 ON s.CreatedBy = usr2.Id
INNER JOIN [NIS].[TenantEntity] ent ON s.EntityId = ent.Id
INNER JOIN [NIS].[WidgetPageTypeMap] wpt ON wpt.WidgetId = s.Id AND wpt.IsDynamicWidget = 1
LEFT JOIN [NIS].[PageType] pt ON wpt.PageTypeId = pt.id
GROUP BY s.Id, s.EntityId, s.PublishedBy, s.CloneOfWidgetId, s.LastUpdatedBy, usr1.FirstName, usr1.LastName, 
usr2.FirstName, usr2.LastName, ent.Name, ent.APIPath, ent.RequestType, s.IsActive, s.IsDeleted, wpt.PageTypeId