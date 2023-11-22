﻿// <copyright file="AssetSettingManager.cs" company="Websym Solutions Pvt. Ltd.">
// Copyright (c) 2018 Websym Solutions Pvt. Ltd..
// </copyright>
//-----------------------------------------------------------------------

namespace nIS
{
    #region References

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Unity;

    #endregion


    /// <summary>
    /// This class implements manager layer of asset library manager.
    /// </summary>
    public class AssetSettingManager
    {
        #region Private members
        /// <summary>
        /// The unity container
        /// </summary>
        private IUnityContainer unityContainer = null;

        /// <summary>
        /// The asset library repository.
        /// </summary>
        IAssetSettingRepository assetSettingRepository = null;


        #endregion

        #region Constructor

        /// <summary>
        /// This is constructor for asset library manager, which initialise
        /// asset library repository.
        /// </summary>
        /// <param name="container">IUnity container implementation object.</param>
        public AssetSettingManager(IUnityContainer unityContainer)
        {
            try
            {
                this.unityContainer = unityContainer;
                this.assetSettingRepository = this.unityContainer.Resolve<IAssetSettingRepository>();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion

        #region Public Methods

        #region Asset Libraries Functions

        /// <summary>
        /// This method will call get asset library method of repository.
        /// </summary>
        /// <param name="assetSettingSearchParameter">The asset library search parameters.</param>
        /// <param name="tenantCode">The tenant code.</param>
        /// <returns>
        /// Returns roles if found for given parameters, else return null
        /// </returns>
        public IList<AssetSetting> GetAssetSettings(string tenantCode)
        {
            IList<AssetSetting> assetLibraries = new List<AssetSetting>();
            try
            {

                assetLibraries = this.assetSettingRepository.GetAssetSettings(tenantCode);
            }
            catch (Exception exception)
            {
                throw exception;
            }
            return assetLibraries;
        }
        /// <summary>
        /// This method will call add asset library method of repository.
        /// </summary>
        /// <param name="assetLibraries">Asset library are to be add.</param>
        /// <param name="tenantCode">Tenant code of asset library.</param>
        /// <returns>
        /// Returns true if entities added successfully, false otherwise.
        /// </returns>
        public bool Save(AssetSetting setting, string tenantCode)
        {
            bool result = false;
            try
            {
                this.IsValidAssetSetting(setting, tenantCode);

                result = assetSettingRepository.Save(setting, tenantCode);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion


        #endregion

        #region Private Methods


        #region Asset Libraries


        /// <summary>
        /// This method is responsible for validate asset s.
        /// </summary>
        /// <param name="assets"></param>
        /// <param name="tenantCode"></param>
        private void IsValidAssetSetting(AssetSetting item, string tenantCode)
        {
            try
            {

                InvalidAssetException invalidAssetException = new InvalidAssetException(tenantCode);

                try
                {
                    item.IsValid();
                }
                catch (Exception ex)
                {
                    invalidAssetException.Data.Add(item.Identifier, ex.Data);
                }


                if (invalidAssetException.Data.Count > 0)
                {
                    throw invalidAssetException;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        #endregion


        #endregion
    }
}
