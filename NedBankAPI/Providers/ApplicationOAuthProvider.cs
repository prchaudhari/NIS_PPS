﻿// <copyright file="ApplicationOAuthProvider.cs" company="Websym Solutions Pvt Ltd">
// Copyright (c) 2017 Websym Solutions Pvt Ltd.
// </copyright>
// -----------------------------------------------------------------------  

namespace nIS
{
    #region References

    using Microsoft.Owin.Security;
    using Microsoft.Owin.Security.OAuth;
    using NedbankAPI;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Security.Claims;
    using System.Threading.Tasks;

    #endregion

    /// <summary>
    /// This class represents oauth provider which handles login request.
    /// </summary>
    public class ApplicationOAuthProvider : OAuthAuthorizationServerProvider
    {
        #region Private Members

        /// <summary>
        /// Public client id
        /// </summary>
        private readonly string publicClientId;

        #endregion

        #region Constructor
        /// <summary>
        /// Initializing instance of class
        /// </summary>
        /// <param name="publicClientId">
        /// Public client id
        /// </param>
        public ApplicationOAuthProvider(string publicClientId)
        {
            if (publicClientId == null)
            {
                throw new ArgumentNullException("publicClientId");
            }

            this.publicClientId = publicClientId;
        }
        #endregion

        /// <summary>
        /// This method will handle login request and generate a token using claims. 
        /// </summary>
        /// <param name="context">
        /// OAuthGrantResourceOwnerCredentialsContext object
        /// </param>
        /// <returns>
        /// 
        /// </returns>
        //public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        //{
        //    //context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });

        //    string tenantCode = context.ClientId;
        //    User user = null;
        //    try
        //    {
        //        if (string.IsNullOrWhiteSpace(context.UserName) || string.IsNullOrWhiteSpace(context.Password))
        //        {
        //            throw new Exception(tenantCode);
        //        }

        //        user = new AuthenticationManager(Container.GetUnityContainer()).UserAuthenticate(context.UserName, context.Password, tenantCode);
        //    }
        //    catch (Exception catchException)
        //    {
        //        string message = string.Empty;
        //        if (catchException.Message.Contains("~"))
        //        {
        //            message = catchException.Message.Split('~')[1];
        //        }
        //        context.SetError("invalid_grant", message);
        //        return;
        //    }

        //    //to check login user is instant tenant manager or tenant group manager
        //    var isInstanceTenantManager = false;
        //    var isTenantGroupManager = false;
        //    var isUserHaveMultiTenantAccess = false;

        //    ClientSearchParameter clientSearchParameter = new ClientSearchParameter
        //    {
        //        TenantCode = user.TenantCode,
        //        IsCountryRequired = false,
        //        IsContactRequired = false,
        //        PagingParameter = new PagingParameter
        //        {
        //            PageIndex = 0,
        //            PageSize = 0,
        //        },
        //        SortParameter = new SortParameter()
        //        {
        //            SortOrder = SortOrder.Ascending,
        //            SortColumn = "Id",
        //        },
        //        SearchMode = SearchMode.Equals,
        //        IsSubscriptionRequired = true,
        //    };
        //    var lstTenants = new ClientManager(Container.GetUnityContainer()).GetClients(clientSearchParameter, tenantCode);
        //    var ParentTenentCode = string.Empty;
        //    if (lstTenants.Count > 0)
        //    {
        //        var tenant = lstTenants.FirstOrDefault();
        //        if (tenant.TenantType == "Tenant" && tenant.IsTenantConfigured == false)
        //        {
        //            context.SetError("invalid_grant", "Tenant on boarding is in process, till then please wait or contact Admin.");
        //            return;
        //        }
        //        if (tenant.TenantType == "Tenant")
        //        {

        //            //Guid key = new Guid(tenant.SubscriptionKey);
        //            //var dateBytes = key.ToByteArray();

        //            //Array.Resize(ref dateBytes, 8);

        //            //var date = new DateTime((long)BitConverter.ToUInt64(dateBytes, 0));
        //            if (!tenant.IsSubscriptionPresent)
        //            {
        //                context.SetError("invalid_grant", "Tenant subscription is not available, please contact Admin.");
        //                return;
        //            }
        //            if (tenant.IsSubscriptionExpire)
        //            {
        //                context.SetError("invalid_grant", "Tenant subscription is expired, please contact Admin.");
        //                return;
        //            }
        //        }
        //        ParentTenentCode = (tenant.ParentTenantCode == null || tenant.ParentTenantCode == string.Empty) ? tenantCode : tenant.ParentTenantCode;
        //        if (tenant.TenantType == "Instance" && user.IsInstanceManager)
        //        {
        //            isInstanceTenantManager = true;
        //            ParentTenentCode = tenantCode; //Instant tenant manager, itself is the super parent for all tenant.
        //        }
        //        else if (tenant.TenantType == "Group" && user.IsGroupManager)
        //        {
        //            isTenantGroupManager = true;
        //            ParentTenentCode = tenant.TenantCode; //Group manager, itself is the parent tenant
        //        }

        //    }

        //    if (!isInstanceTenantManager)
        //    {
        //        //To check if user has more than one tenant access of tenant group under which he belongs
        //        MultiTenantUserRoleAccessSearchParameter multiTenantUserRoleAccessSearchParameter = new MultiTenantUserRoleAccessSearchParameter
        //        {
        //            IsActive = true,
        //            UserId = user.Identifier,
        //            PagingParameter = new PagingParameter
        //            {
        //                PageIndex = 0,
        //                PageSize = 0,
        //            },
        //            SortParameter = new SortParameter()
        //            {
        //                SortOrder = SortOrder.Ascending,
        //                SortColumn = "LastUpdatedDate",
        //            },
        //            SearchMode = SearchMode.Equals
        //        };
        //        var lstTenantUserRoleAccess = new MultiTenantUserRoleAccessManager(Container.GetUnityContainer()).GetMultiTenantUserRoleAccessList(multiTenantUserRoleAccessSearchParameter, ParentTenentCode);
        //        if (lstTenantUserRoleAccess.Count > 0)
        //        {
        //            isUserHaveMultiTenantAccess = true;
        //        }
        //    }

        //    var UserTheme = "Theme0";
        //    if (!user.IsInstanceManager && !user.IsInstanceManager)
        //    {
        //        var tenantConfigs = new TenantConfigurationManager(Container.GetUnityContainer()).GetTenantConfigurations(user.TenantCode);
        //        if (tenantConfigs != null && tenantConfigs.Count > 0)
        //        {
        //            UserTheme = tenantConfigs[0].ApplicationTheme;
        //        }
        //    }

        //    // Adding claims
        //    ClaimsIdentity claimIdentity = new ClaimsIdentity("JWT");
        //    claimIdentity.AddClaim(new Claim(ClaimType.UserIdentifier.ToString(), user.EmailAddress.ToString()));
        //    claimIdentity.AddClaim(new Claim(ClaimType.TenantCode.ToString(), user.TenantCode));
        //    claimIdentity.AddClaim(new Claim(ClaimType.UserId.ToString(), user.Identifier.ToString()));
        //    claimIdentity.AddClaim(new Claim(ClaimType.UserFullName.ToString(), user.FirstName + " " + user.LastName));

        //    List<RolePrivilege> userCliams = new List<RolePrivilege>();
        //    userCliams.AddRange(user.Roles.SelectMany(role => role.RolePrivileges).ToList());

        //    userCliams?.ToList().ForEach(privilege =>
        //    {
        //        claimIdentity.AddClaim(new Claim(privilege.EntityName, string.Join(",", privilege.RolePrivilegeOperations)));
        //    });

        //    //Add is asset connected value in claim
        //    var MinimumArchivalPeriodDays = int.Parse(ConfigurationManager.AppSettings["MinimumArchivalPeriodDays"] ?? "30");

        //    string[] propertyData = new string[14]
        //    {
        //        user.Identifier.ToString(),
        //        user.FirstName + " " + user.LastName,
        //        user.EmailAddress,
        //        user.TenantCode,
        //        (userCliams?.Count>0?JsonConvert.SerializeObject(userCliams):string.Empty),
        //        (user.Roles.Count() > 0 ? user.Roles[0].Name : ""),
        //        (user.Roles.Count() > 0 ? user.Roles[0].Identifier.ToString() : ""),
        //        (user.DateFormat),
        //        isInstanceTenantManager.ToString(),
        //        isTenantGroupManager.ToString(),
        //        isUserHaveMultiTenantAccess.ToString(),
        //        user.IsPasswordResetByAdmin.ToString(),
        //        UserTheme,
        //        MinimumArchivalPeriodDays.ToString()
        //    };

        //    AuthenticationTicket ticket = new AuthenticationTicket(claimIdentity, CreateProperties(propertyData));
        //    context.Validated(ticket);
        //}

        ///// <summary>
        ///// This method will set all properties.
        ///// </summary>
        ///// <param name="context">
        ///// OAuthTokenEndpointContext object.
        ///// </param>
        ///// <returns>
        ///// Returns a task object.
        ///// </returns>
        //public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        //{
        //    foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
        //    {
        //        context.AdditionalResponseParameters.Add(property.Key, property.Value);
        //    }

        //    return Task.FromResult<object>(null);
        //}

        ///// <summary>
        ///// This method will validate our client id as tenant code.
        ///// </summary>
        ///// <param name="context">
        ///// OAuthValidateClientAuthenticationContext object.
        ///// </param>
        ///// <returns>
        ///// Returns task object.
        ///// </returns>
        //public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        //{
        //    string clientId = string.Empty;
        //    string clientSecret = string.Empty;
        //    // Resource owner password credentials does not provide a client ID.
        //    if (!context.TryGetBasicCredentials(out clientId, out clientSecret))
        //    {
        //        context.TryGetFormCredentials(out clientId, out clientSecret);
        //    }

        //    if (context.ClientId == null)
        //    {
        //        context.SetError("invalid_clientId", "Tenant code is not set.");
        //        return Task.FromResult<object>(null);
        //    }

        //    context.Validated();
        //    return Task.FromResult<object>(null);
        //}

        //public override Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context)
        //{
        //    if (context.ClientId == this.publicClientId)
        //    {
        //        Uri expectedRootUri = new Uri(context.Request.Uri, "/");

        //        if (expectedRootUri.AbsoluteUri == context.RedirectUri)
        //        {
        //            context.Validated();
        //        }
        //    }

        //    return Task.FromResult<object>(null);
        //}

        ///// <summary>
        ///// This method sets properties in authentication properties object.
        ///// </summary>
        ///// <param name="userName">
        ///// User name or user email address.
        ///// </param>
        ///// <param name="userIdentifier">
        ///// User identifier.
        ///// </param>
        ///// <returns>
        ///// It returns authentication properties object.
        ///// </returns>
        //public static AuthenticationProperties CreateProperties(string[] stringData)
        //{
        //    IDictionary<string, string> data = new Dictionary<string, string>
        //    {
        //        { "UserIdentifier", stringData[0] },
        //        { "UserName", stringData[1] },
        //        { "UserPrimaryEmailAddress" , stringData[2]},
        //        { "TenantCode", stringData[3] },
        //        { "SerializedUserClaims", stringData[4] },
        //        { "RoleName", stringData[5] },
        //        { "RoleIdentifier", stringData[6] },
        //        { "DateFormat",stringData[7] },
        //        { "IsInstanceTenantManager",stringData[8] },
        //        { "IsTenantGroupManager",stringData[9] },
        //        { "IsUserHaveMultiTenantAccess",stringData[10] },
        //        { "IsPasswordResetByAdmin",stringData[11] },
        //        { "UserTheme",stringData[12] },
        //        { "MinimumArchivalPeriodDays",stringData[13] }
        //    };
        //    return new AuthenticationProperties(data);
        //}
    }
}