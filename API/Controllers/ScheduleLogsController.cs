﻿// <copyright file="ScheduleLogsController.cs" company="Websym Solutions Pvt Ltd">
// Copyright (c) 2020 Websym Solutions Pvt Ltd.
// </copyright>
// -----------------------------------------------------------------------  

namespace nIS
{
    using Newtonsoft.Json;

    #region References

    using OfficeOpenXml;
    using OfficeOpenXml.Style;
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Web;
    using System.Web.Http;
    using System.Web.Http.Cors;
    using Unity;

    #endregion

    /// <summary>
    /// This class represent api controller for schedule log
    /// </summary>
    [EnableCors("*", "*", "*", "*")]
    [RoutePrefix("ScheduleLog")]
    public class ScheduleLogsController : ApiController
    {
        #region Private Members

        /// <summary>
        /// The schedule log manager object.
        /// </summary>
        private ScheduleLogManager scheduleLogManager = null;

        /// <summary>
        /// The unity container
        /// </summary>
        private readonly IUnityContainer unityContainer = null;

        /// <summary>
        /// The utility object
        /// </summary>
        private IUtility utility = null;

        /// <summary>
        /// The tenant config manager object.
        /// </summary>
        private TenantConfigurationManager tenantConfigurationManager = null;

        /// <summary>
        /// The StatementSearch manager object.
        /// </summary>
        private StatementSearchManager StatementSearchManager = null;

        #endregion

        #region Constructor

        public ScheduleLogsController(IUnityContainer unityContainer)
        {
            this.unityContainer = unityContainer;
            this.utility = new Utility();
            this.scheduleLogManager = new ScheduleLogManager(this.unityContainer);
            this.tenantConfigurationManager = new TenantConfigurationManager(unityContainer);
            this.StatementSearchManager = new StatementSearchManager(unityContainer);
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// This method helps to get schedule log list based on the search parameters.
        /// </summary>
        /// <param name="scheduleLogSearchParameter"></param>
        /// <returns>List of asset libraries</returns>
        [HttpPost]
        public IList<ScheduleLog> List(ScheduleLogSearchParameter scheduleLogSearchParameter)
        {
            IList<ScheduleLog> scheduleLogs = new List<ScheduleLog>();
            try
            {
                string tenantCode = Helper.CheckTenantCode(Request.Headers);
                scheduleLogs = this.scheduleLogManager.GetScheduleLogs(scheduleLogSearchParameter, tenantCode);
                HttpContext.Current.Response.AppendHeader("recordCount", this.scheduleLogManager.GetScheduleLogsCount(scheduleLogSearchParameter, tenantCode).ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return scheduleLogs;
        }

        /// <summary>
        /// This method helps to re run the schedule for failed customer records
        /// </summary>
        /// <param name="scheduleLogIdentifier">The schedule log identifier</param>
        /// <param name="baseURL">The base URL</param>
        /// <param name="tenantCode">The tenant code</param>
        /// <returns>True if statements generates successfully runs successfully, false otherwise</returns>
        [HttpGet]
        public bool ReRunSchedule(long scheduleLogIdentifier)
        {
            try
            {
                string tenantCode = Helper.CheckTenantCode(Request.Headers);
                var baseURL = Url.Content("~/");
                var outputLocation = AppDomain.CurrentDomain.BaseDirectory;
                var tenantConfiguration = this.tenantConfigurationManager.GetTenantConfigurations(tenantCode)?.FirstOrDefault();
                if (!string.IsNullOrEmpty(tenantConfiguration.OutputHTMLPath))
                {
                    baseURL = tenantConfiguration.OutputHTMLPath;
                    outputLocation = tenantConfiguration.OutputHTMLPath;
                }
                return this.scheduleLogManager.ReRunScheduleForFailedCases(scheduleLogIdentifier, baseURL, outputLocation, tenantConfiguration, tenantCode);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// This method helps to get schedule log details list based on the search parameters.
        /// </summary>
        /// <param name="scheduleLogDetailSearchParameter"></param>
        /// <returns>List of asset libraries</returns>
        [HttpPost]
        [Route("ScheduleLogDetail/List")]
        public IList<ScheduleLogDetail> GetScheduleLogDetails(ScheduleLogDetailSearchParameter scheduleLogDetailSearchParameter)
        {
            IList<ScheduleLogDetail> scheduleLogDetails = new List<ScheduleLogDetail>();
            try
            {
                string tenantCode = Helper.CheckTenantCode(Request.Headers);
                scheduleLogDetails = this.scheduleLogManager.GetScheduleLogDetails(scheduleLogDetailSearchParameter, tenantCode);
                HttpContext.Current.Response.AppendHeader("recordCount", this.scheduleLogManager.GetScheduleLogDetailsCount(scheduleLogDetailSearchParameter, tenantCode).ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return scheduleLogDetails;
        }

        /// <summary>
        /// This method helps to retry to generate html statements for failed customer records
        /// </summary>
        /// <param name="scheduleLogDetails">The schedule log detail object list</param>
        /// <returns>True if statements generates successfully runs successfully, false otherwise</returns>
        [HttpPost]
        [Route("ScheduleLogDetail/Retry")]
        public bool RetryStatementForFailedCustomerReocrds(IList<ScheduleLogDetail> scheduleLogDetails)
        {
            try
            {
                string tenantCode = Helper.CheckTenantCode(Request.Headers);
                var baseURL = Url.Content("~/");
                var outputLocation = AppDomain.CurrentDomain.BaseDirectory;
                var tenantConfiguration = this.tenantConfigurationManager.GetTenantConfigurations(tenantCode)?.FirstOrDefault();
                if (!string.IsNullOrEmpty(tenantConfiguration.OutputHTMLPath))
                {
                    baseURL = tenantConfiguration.OutputHTMLPath;
                    outputLocation = tenantConfiguration.OutputHTMLPath;
                }
                return this.scheduleLogManager.RetryStatementForFailedCustomerReocrds(scheduleLogDetails, baseURL, outputLocation, tenantConfiguration, tenantCode);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// This method helps to download error message of failed customer records for given schedule log in excel
        /// </summary>
        /// <param name="ScheduleLogIndentifier">The schedule log detail object list</param>
        /// <returns>return excel file in the http response</returns>
        [HttpGet]
        public HttpResponseMessage DownloadErrorLogs(long ScheduleLogIndentifier)
        {
            HttpResponseMessage httpResponseMessage = new HttpResponseMessage();
            string filePath = string.Empty;
            try
            {
                string tenantCode = Helper.CheckTenantCode(Request.Headers);
                var scheduleLogErrors = this.scheduleLogManager.GetScheduleLogErrorDetails(ScheduleLogIndentifier, tenantCode);
                int num = 1;
                System.Text.RegularExpressions.Regex regex = new System.Text.RegularExpressions.Regex("<[^>]*>");
                scheduleLogErrors.ForEach(logError => {
                    logError.ErrorLogMessage = logError.ErrorLogMessage.Replace("<li>", num.ToString() + " - ").Replace("</li>", " ");
                    logError.ErrorLogMessage = regex.Replace(logError.ErrorLogMessage, "");
                    num++;
                });

                string fileName = "ErrorLogs_" + ScheduleLogIndentifier + "_" + DateTime.Now.ToString().Replace("-", "_").Replace(":", "_").Replace(" ", "_").Replace('/', '_') + ".xlsx";
                string fileDirectoryPath = AppDomain.CurrentDomain.BaseDirectory + "\\Resources\\sampledata\\";
                if (!Directory.Exists(fileDirectoryPath))
                {
                    Directory.CreateDirectory(fileDirectoryPath);
                }

                filePath = fileDirectoryPath + fileName;
                if (!File.Exists(filePath))
                {
                    File.Delete(filePath);
                }

                bool result = this.GenerateExcel(scheduleLogErrors, filePath);
                if (result)
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        using (FileStream file = new FileStream(filePath, FileMode.Open, FileAccess.Read))
                        {
                            byte[] bytes = new byte[file.Length];
                            file.Read(bytes, 0, (int)file.Length);
                            ms.Write(bytes, 0, (int)file.Length);

                            httpResponseMessage.Content = new ByteArrayContent(bytes.ToArray());
                            httpResponseMessage.Content.Headers.Add("x-filename", fileName);
                            httpResponseMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                            httpResponseMessage.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                            httpResponseMessage.Content.Headers.ContentDisposition.FileName = fileName;
                            httpResponseMessage.StatusCode = HttpStatusCode.OK;
                            ms.Position = 0;
                        }
                    }
                }
                else
                {
                    httpResponseMessage.StatusCode = HttpStatusCode.InternalServerError;
                }

                return httpResponseMessage;
            }
            catch (IOException)
            {
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (filePath != string.Empty && File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }
        }

        /// <summary>
        /// This method helps to get dashboard data
        /// </summary>
        /// <returns>dashboard data object</returns>
        [HttpGet]
        [Route("Dashboard/Get")]
        public DashboardData GetDashboardData()
        {
            try
            {
                string tenantCode = Helper.CheckTenantCode(Request.Headers);
                return this.scheduleLogManager.GetDashboardData(tenantCode);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// This method helps to download statement in HTML format
        /// </summary>
        /// <param name="logDetail">The schedule log detail object </param>
        /// <returns>return HTML statement file in the http response</returns>
        [HttpPost]
        [Route("ScheduleLogDetail/DownloadHTMLStatement")]
        public HttpResponseMessage DownloadHTMLStatement(ScheduleLogDetail logDetail)
        {
            try
            {
                string tenantCode = Helper.CheckTenantCode(Request.Headers);
                var metadataRecord = this.StatementSearchManager.GetStatementSearchs(new StatementSearchSearchParameter()
                {
                    CustomerId = logDetail.CustomerId.ToString(),
                    ScheduleLogId = logDetail.ScheduleLogId.ToString(),
                    IsPasswordRequired = false,
                    PagingParameter = new PagingParameter
                    {
                        PageIndex = 0,
                        PageSize = 0,
                    },
                    SortParameter = new SortParameter()
                    {
                        SortOrder = SortOrder.Ascending,
                        SortColumn = "Id",
                    },
                    SearchMode = SearchMode.Equals
                }, tenantCode)?.ToList()?.FirstOrDefault();
                if (metadataRecord != null)
                {
                    string BaseUrl = ConfigurationManager.AppSettings[ModelConstant.WEB_API_BASE_URL].ToString();
                    var apiName = "StatementSearch/Download?identifier=" + metadataRecord.Identifier;

                    HttpClient client = new HttpClient();
                    client.BaseAddress = new Uri(BaseUrl);
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(ModelConstant.APPLICATION_JSON_MEDIA_TYPE));
                    client.DefaultRequestHeaders.Add(ModelConstant.TENANT_CODE_KEY, tenantCode);
                    client.DefaultRequestHeaders.Authorization = Request.Headers.Authorization;
                    return client.GetAsync(apiName)?.Result;
                }
                else
                {
                    HttpResponseMessage httpResponseMessage = new HttpResponseMessage();
                    httpResponseMessage.StatusCode = HttpStatusCode.BadRequest;
                    return httpResponseMessage;
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// This method helps to download statement in PDF format
        /// </summary>
        /// <param name="logDetail">The schedule log detail object </param>
        /// <returns>return PDF statement file in the http response</returns>
        [HttpPost]
        [Route("ScheduleLogDetail/ExportToPDF")]
        public HttpResponseMessage ExportHtmlStatementToPDF(ScheduleLogDetail logDetail)
        {
            HttpResponseMessage httpResponseMessage = new HttpResponseMessage();
            httpResponseMessage.StatusCode = HttpStatusCode.BadRequest;
            try
            {
                string tenantCode = Helper.CheckTenantCode(Request.Headers);

                if (logDetail != null)
                {
                    var scheduleLogs = scheduleLogManager.GetScheduleLogDetails(new ScheduleLogDetailSearchParameter() 
                    {
                        ScheduleLogDetailId = logDetail.Identifier.ToString(),
                        PagingParameter = new PagingParameter
                        {
                            PageIndex = 0,
                            PageSize = 0,
                        },
                        SortParameter = new SortParameter()
                        {
                            SortOrder = SortOrder.Ascending,
                            SortColumn = "Id",
                        },
                        SearchMode = SearchMode.Equals
                    }, tenantCode);
                    if(scheduleLogs != null)
                    {
                        var scheduleLog = scheduleLogs.FirstOrDefault();

                        var pdfFileName = Path.GetFileNameWithoutExtension(scheduleLog.StatementFilePath) + ".pdf";
                        var pdfFilePath = Path.Combine(Path.GetDirectoryName(scheduleLog.StatementFilePath), pdfFileName);

                        byte[] fileBytes = System.IO.File.ReadAllBytes(pdfFilePath);
                        //return FileR(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);

                        using (MemoryStream ms = new MemoryStream())
                        {
                            using (FileStream file = new FileStream(pdfFilePath, FileMode.Open, FileAccess.Read))
                            {
                                byte[] bytes = new byte[file.Length];
                                file.Read(bytes, 0, (int)file.Length);
                                ms.Write(bytes, 0, (int)file.Length);
                                httpResponseMessage.Content = new ByteArrayContent(bytes.ToArray());
                                httpResponseMessage.Content.Headers.Add("x-filename", pdfFileName);
                                httpResponseMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                                httpResponseMessage.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                                httpResponseMessage.Content.Headers.ContentDisposition.FileName = pdfFileName;
                                httpResponseMessage.StatusCode = HttpStatusCode.OK;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return httpResponseMessage;
        }


        #endregion

        #region Private Methods

        /// <summary>
        /// This method helps to generate excel file using list of objects
        /// </summary>
        /// <param name="scheduleLogErrors">The schedule log detail object list</param>
        /// <param name="filePath">The location where to saved excel file</param>
        /// <returns>return true if excel generated successfully</returns>
        private bool GenerateExcel(List<ScheduleLogErrorDetail> scheduleLogErrors, string filePath)
        {
            try
            {
                ExcelPackage excel = new ExcelPackage();
                var workSheet = excel.Workbook.Worksheets.Add("Sheet1");
                workSheet.TabColor = System.Drawing.Color.Black;
                workSheet.DefaultRowHeight = 12;

                workSheet.Row(1).Height = 20;
                workSheet.Row(1).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Row(1).Style.Font.Bold = true;

                workSheet.Cells["A1"].LoadFromCollection(Collection: scheduleLogErrors, PrintHeaders: true);

                int recordIndex = 2;
                foreach (var logError in scheduleLogErrors)
                {
                    workSheet.Cells[recordIndex, 9].Style.Numberformat.Format = "dd-MM-yyyy HH:mm";
                    recordIndex++;
                }

                excel.SaveAs(new FileInfo(filePath));
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion
    }
}