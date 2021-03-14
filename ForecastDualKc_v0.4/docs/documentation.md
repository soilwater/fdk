# ForecastDualKc Docs

[FDK](https://soilwater.github.io/fdk) is a simple semi-e,pirical soil water balance model capable of generating an ensemble of field-specific projections of soil moisture conditions, crop water use, and probable yield based on current crop conditions and historical weather records. The FDK model is largely based on the Food and Agricultural Organization Irrigation and Drainage Paper #56 dual crop coefficient method (Allen et al., 1998). The adoption of this model was motivated by the model simplicity, relatively good accuracy for computing the soil water balance, and the large user community. Users interested in more accurate and detailed crop, nitrogen, and soil water dynamics may want to use more sophisticated mechanistic models. The web-based tool is aimed at anyone interested in using an interactive and simple soil water balance model to visualize plausible crop water use scenarios and inform in-season management decisions.

Table of Contents

- [ForecastDualKc Docs](#forecastdualkc-docs)
  - [1. Features of the User Interface](#1-features-of-the-user-interface)
  - [2. Model Modifications](#2-model-modifications)
  - [3. Inputs](#3-inputs)
    - [3.1 Soil](#31-soil)
    - [3.2 Plant](#32-plant)
    - [3.3 Atmosphere](#33-atmosphere)
      - [Table of atmospheric variables](#table-of-atmospheric-variables)
      - [Table of field observations](#table-of-field-observations)
  - [4. Technical Description](#4-technical-description)
    - [4.1 Reference evapotranspiration](#41-reference-evapotranspiration)
    - [4.2 Thermal Units](#42-thermal-units)
    - [4.3 Canopy growth](#43-canopy-growth)
    - [4.4 Actual crop evapotrasnpiration](#44-actual-crop-evapotrasnpiration)
    - [4.5 Soil water balance computation](#45-soil-water-balance-computation)
    - [4.6 ET Partitioning](#46-et-partitioning)
    - [4.7 Grain yield](#47-grain-yield)
    - [4.8 Nitrogen recommendation](#48-nitrogen-recommendation)
  - [5. Datasets](#5-datasets)
  - [6. To-Do List](#6-to-do-list)
  - [7. Model Dependencies](#7-model-dependencies)
  - [8. Team](#8-team)
  - [9. References](#9-references)

<a name="features"></a>

## 1. Features of the User Interface

- No need to download and install any software. The tool runs entirely in the browser.
  
- No log in credentials and no need to remember another password.

- Everything you do remains private in your local computer. Climate data, weather data, and model settings are not shared with any remote server. We only collect basic website traffic to quantify the number and demographics of users. We don't use any cookies.
  
- Interactive and responsive user interface. Model results update in real time making it easy to fine-tune the model and visualize a range of possible scenarios.

- Allows for direct integration of irrigation amount, green canopy cover, and soil moisture observations.

<a name="modifications"></a>

## 2. Model Modifications

Feature|FAO-56|ForecastDualKc
:---|:---|:---
`Basal crop coefficient`|Based on calendar days|Based on thermal units
`Fraction of canopy cover`|Estimated from the crop coefficients and plant height|Simulated using a simple model as a function of thermal units
`Crop stages`|Calendar days|Cumulative thermal units
`Timing of initial canopy cover computation`| From planting|From emergence

>Similarly to the dual crop coefficient method described in the FAO-56 publication, this model also errs on the side of simplicity. This means that some complex biological (e.g.phenology, root growth, canopy growth) and soil physical processes (e.g. infiltration, soil water redistribution) are simulated using simplified approaches that may not always be accurate. The model was implemented under the assumption that the uncertainty due to model simplifications is low compared to the year-to-year variability of the projected scenarios.

<a name="inputs"></a>

## 3. Inputs

The model requires inputs about basic soil physical properties, timing of the most important phenological stages, historical weather records, and basic management information.

<a name="inputs-soil"></a>

### 3.1 Soil

Property|Units|Typical Range|Description
:---|:---:|:---:|:---
`Depth surface layer`|m|0.10-0.20| Thickness of the top of soil layer primarily subjected to evaporative losses.
`Readily evaporable water`|m|0.30-0.50 | Fraction of the total evaporable water that is subjected to stage 1 evaporation.
`Initial surface soil moisture`|$m^3/m^3$|0.20-0.25|Soil water content in the surface layer at the beginning of the simulation.
`Initial rootzone soil moisture`|$m^3/m^3$|0.20-0.35|Soil water content in the rootzone at the beginning of the simulations.
`Lower limit`|$m^3/m^3$|0.05-0.20|Permanent wilting point (-1500 kPa). Strongly dependent on the soil texture
`Upper limit`|$m^3/m^3$|0.25-0.35|Field capacity (-10 kPa). Strongly dependent on soil texture, soil structure, and organic matter. We suggest using upper limit values corresponding to a matric potential of -10 kPa instead of -33 kPa.
`Residue cover`|Percentage|0-100|Percent of the soil surface covered with crop stubble. Strongly dependent on the tillage system.
`Fraction area wetted by irrigation`|Unitless|0.2-1.0|Fraction of the soil surface wetted by precipitation or irrigation events. Natural precipitation (1.0), sprinklers (1.0), sub-surface drip irrigation(0.2).
`Curve number`|Unitless|75-92|USDA Soil Conservation Service curve number for estimating runoff. Higher numbers indicate higher runoff.

<a name="inputs-plant"></a>

### 3.2 Plant

Property|Units|Typical Range|Description
:---|:---:|:---:|:---
`Stage:Emergence`|C-day|100-150|Number of thermal units from sowing to emergence.
`Stage: Initial`|C-day|400-1000|Number of thermal units from emergence to end of the initial stage (typically the period with canopy cover <10%-20%).
`Stage:Development`|C-day|800-1400|Number of thermal units to reach peak canopy cover. Typically the end of the vegetative period (e.g. flag leaf).
`Stage:Middle stage`|C-day|1500-2200|Number of thermal units that the crop remains at maximum canopy cover. Typically most of the reproductive stage.
`Stage:Late`|C-day|2000-2500|Thermal units from physiological maturity or end of grain/fruit filling period to harvest.
`Kcb ini`|Unitless|0-0.4|Initial basal crop coefficient.
`Kcb mid`|Unitless|0.8-1.20|Mid-season basal crop coefficient at or near peak canopy cover.
`Kcb late`|Unitless|0.9-1.2|Late-season basal crop coefficient.
`Tbase`|Celsius|0-10|Base temperature for crop development.
`Tupper`|Celsius|32-40|Upper temperature for crop development.
`Maximum plant height`|m|1.0-2.0|Maximum plant height during the growing season. For most agricultural crops the time of maximum plant height matches the end of the vegetative growth period.
`Maximum root depth`|m|1.0-3.0|Maximum root depth during the growing season. For most agricultural crops the time of maximum root depth matches the end of the vegetative growth period.
`pTab`|Unitless|0.3-0.7|Fraction of the total plant available water that is readily available to plant roots. Lower values imply higher susceptibility to soil water stress.
`Yield response factor`|Unitless|0.9-1.5|An empirical coefficient that relates the reduction in yield in terms of the reduction in the ratio of actual/potential crop transpiration as a consequence of seasonal soil water deficits.
`Yield potential`|Mg/ha|3.0-8.0|Field-specific potential yield assuming no water limitations during the growing season.

>Note that the timing of crop stages can be highly affected by the choice of base temperature.

<a name="inputs-atmosphere"></a>

### 3.3 Atmosphere

In light of uncertain future environmental conditions, the FDK model allows users to visualize an ensemble of plausible outcomes based on historical scenarios. The model incorporates historical and seasonal observations using two data structures:

`Weather` represents the atmospheric observations from the beginning of the growing season until present time. This information can be obtained from a regional environmental monitoring network or from a simple weather station deployed in the field under simulation. The `Weather` file can also incorporate observations of irrigation amount, green canopy cover, and surface and rootzone soil moisture observations.

> The soil water balance is highly sensitive to water inputs. We recommend using accurate precipitation (and irrigation) information collected either at the site or at a nearby monitoring station.

    Headers of weather (order matters)
    
    year | month | day| tempMax | tempMin |rhMax | rhMin | solarRad | windSpeed | precip | irrigation* | surfaceSoilMoisture* | rootzoneSoilMoisture* | canopyCover*

  >`*` Indicates optional variables. If no information is available for these optional variables, leave fields blank, but keep the headers in the file.

`Climate` refers to long-term (>10 years) records of atmospheric variables. Unlike weather observations, climate records can be obtained from a regional monitoring station (e.g. county, agroclimatic division).

    Headers of climate file (order matters)
    
    year | month | day| tempMax | tempMin |rhMax | rhMin | solarRad | windSpeed | precip

#### Table of atmospheric variables

Variable|Units|Description
:---|:---:|:---
`year`| - |Integer representing the calendar year [yyyy]
`month`| - | Integer representing the calendar month [mm]
`day`| - | Integer representing the calendar day [dd]
`tempMax`|Celsius| Maximum daily air temperature
`tempMin`|Celsius|Minimum daily air temperature
`rhMax`|%| Maximum daily relative humidity
`rhMin`|%| Minimum daily relative humidity
`solarRad`| MJ/$m^2$/day| Incident solar radiation
`windSpeed`|m/s| Daily average wind speed
`precip`|mm| Daily total precipitation
`irrigation`|mm| Daily total irrigation


#### Table of field observations

Variable|Units|Description
:---|:---:|:---
`surfaceSoilMoistureObs`|mm|Observed soil moisture in the surface layer.
`rootzoneSoilMoistureObs`|mm|Observed soil moisture in the rootzone layer.
`canopyCoverObs`|%|Observed green canopy cover

<a name="technical-description"></a>

## 4. Technical Description

The model is based on the FAO-56 Dual Crop Coefficient (Dual Kc) method (Allen et al 1998). The model relies on grass reference evapotranspiration and a set of crop coefficients that partition transpirational and evaporative losses. While the model closely follows the specifications in the FAO-56 manual, few minor modifications were introduced to enable the assimilation of field observations of irrigation, green canopy cover, and soil moisture. In this version, the basal crop coefficients (Kcb) are not determined following the traditional piecewise linear model as a function of calendar days, but rather as a function of thermal units.

### 4.1 Reference evapotranspiration

Reference ET is modeled following the Penman-Monteith appraoch as described in Chapter 3 of the FAO-56 manual.

$$ETo = \frac{0.408\Delta(Rn-G)+\gamma\frac{900}{T+273}u2(es-ea)}{\Delta+\gamma(1+0.34u2)}$$

ETo = reference evapotranspiration (mm/day)

Rn = net radiation at the crop surface (MJ/m2/day).

G = soil heat flux density (MJ/m2/day)

T = mean daily air temperature at 2 m height

u2 = wind speed at 2 m height (m/s)

es = saturation vapor pressure (kPa)

ea = actual vapor pressure (kPa)

es-ea = saturation vapor pressure deficit (kPa)

$\Delta$ = slope vapor pressure curve (kPa/°C)

$\gamma$ = psychrometric constant (kPa/°C)

### 4.2 Thermal Units

The model uses thermal units to simulate canopy growth and to approximate the timing of crop phenological stages. Daily thermal units ($TU$) are computed as follows (Method 1 in McMaster and Wilhelm 1997):

$$ T_{avg} = \frac{T_{max} + T_{min}}{2}$$

$$ T_{avg} = max(T_{avg},T_{base})$$
$$ T_{avg} = min(T_{avg},T_{upper})$$

$$TU = T_{avg} - T_{base} $$

### 4.3 Canopy growth

Canopy cover ($C$) is modeled as a function of daily thermal units ($TU$). The model scales the range of canopy cover (i.e. 0-100%) between the time of emergence and the end of the development stage. This method provides a first-order approximation to partition the fraction of evaporable water. To improve the accuracy of the canopy cover model we suggest collecting and assimilating observations of green canopy cover. During the development stage, canopy growth is modeled as follows:

$$ C_t = C_{t-1} + \frac{TU_t}{TU_{dev}} $$

During the late stage, the decline in green canopy cover as a result of crop senescence is modeled proportional to the $K_{cb late}$:

$$ C_t = C_{t-1} + (K_{cb \ t} - K_{cb \ t-1})$$

### 4.4 Actual crop evapotrasnpiration

Actual crop evapotranspiration under soil water deficit conditions ($ET_a$) is modeled as the sum of the basal ($K_{cb}$) and evaporation ($K_e$) crop coefficients. In scenarios where plants are subjected to soil water deficits, crop evapotrasnpiration is modulated by a stress factor linearly related to the remaining amount of plant available water in the rootzone:

$$ ET_a = ET_o \ (K_{cb} K_s + K_e)$$

### 4.5 Soil water balance computation

The resulting soil water balance for the rootzone is computed by taking into account the main inputs and outputs of agricultural fields. The rootzone soil water depletion is computed as follows:

$$Dr_t = Dr_{t-1} - (P_t - RO_t) - I_t + ET_{a \ t} + DPr_t$$

$Dr$ is the depletion of the rootzone

$P$ is daily precipitation

$RO$ is the estimated daily runoff

$I$ is the daily irrigation depth

$ETa$ is the daily actual crop evapotranspiration

$DPr$ is the deep percolation of the rootzone

### 4.6 ET Partitioning

The evaporation and transpiration components of the crop evapotranspiration are estimated by decoupling the basal and evaporation crop coefficients:

$$ E = K_e \ ET_{ref}$$

$$ T = K_s \ K_{cb} \ ET_{ref}$$

$T$ is crop transpiration

$E$ is soil evaporation

> The basal crop coefficient (Kcb) includes diffusive water losses from the rootzone layer that are assumed negligible in the computation of the ET partitioning.

### 4.7 Grain yield

Grain yield is approximated following an approach similar to that proposed in the FAO Irrigation and Drainage Paper #33 (Doorenbos and Kassam, 1979). The only difference is that the FDK model uses the ratio of the estimated and potential crop transpiration rather than the estimated and potential evapotranspiration:

$$ \bigg( 1- \frac{Y_a}{Y_p} \bigg) = K_y \bigg(1- \frac{T_a}{T_c}\bigg)$$

$Y_a$ is the actual grain yield in Mg/ha

$Y_p$ is the field-specific (or regional) potential yield in Mg/ha

$T_a$ is the total actual crop transpiration at the end of the growing season

$T_c$ is the total crop transpiration under non-stressed conditions at the end of the growing season

### 4.8 Nitrogen recommendation

The model computes the nitrogen recommendation based on the provided crop-specific nitrogen demand and the median yield goal. Nitrogen levels do not affect model simulations, the updated yield goal is solely based on yield reductions based on soil water deficits. The recommended amount of nitrogen provided by the FDK model is the total amount of nitrogen that would be required by the crop without accounting for any existing soil nitrogen and mineralization rate. Users could use the most probable yield outcome together with external nitrogen recommentdation tools to calculate the amount of nitrogen fertilizer. The nitrogen recommendation is also saved for each scenario and is available in the model outputs.

Recent research (Raun et al., 2017) shows that using yield goals is not an appropriate strategy for determining pre-plant fertilizer nitrogen rates. The FDK model aims at improving the estimation of the crop nitrogen demand by narrowing down the range of probable yield outcomes at the time of in-season nitrogen application. For the case of winter wheat in the U.S. Great Plains, forecasts in late February and early March (i.e. end of vernalization period) should provide a more accurate estimation of the plausible yield goal by accounting for soil moisture and canopy conditions since planting. The integration of observations of green canopy cover at this particular stage is key to account for the impact of snowfall events and low temperatures on the crop canopy. The canopy condition at any particular point during the growing season can be quantified using hand-held NDVI sensors or by measuring the percent of green canopy cover with tools like [Canopeo](https://canopeoapp.com)

<a name="datasets"></a>

## 5. Datasets

The model ships with an example dataset for winter wheat in Stillwater, OK during the 2012-2013 growing season. More information about this dataset can be found in ([Lollato and Edwards, 2015](https://acsess.onlinelibrary.wiley.com/doi/full/10.2135/cropsci2015.04.0215))



<a name="to-do-list"></a>

## 6. To-Do List

- [x] Add figure showing ET partitioning
- [x] Add figure of cumulative yield probability
- [ ] Add table in documentation with soil physical properties for each soil textural class
- [ ] Add table in documentation with crop stages in terms of thermal units for common crops and maturity groups (e.g. wheat, soybeans, corn)
- [ ] Add curated datasets for winter and summer crops containing periodic observations of rootzone soil moisture and canopy cover. This datasets could be used to calibrate the model and provide new users a starting point.

<a name="dependencies"></a>

## 7. Model Dependencies

The core of the model was implemented in Javascript and contains no external dependencies, but few external open-source libraries were used to assist with the graphical user interface:

[Materializecss](https://materializecss.com/) for a modern responsive website layout

[noUiSlider](https://refreshless.com/nouislider/) for stunning sliders

[Plotly](https://plotly.com/javascript/) for great interactive plots

<a name="team"></a>

## 8. Team

**Andres Patrignani** | Assistant Professor in Soil Water Processes, Department of Agronomy, Kansas State University. andrespatrignani@ksu.edu

**Tyson Ochsner** | Professor in Soil Physics, Department of Plant and Soil Sciences, Oklahoma State University.

<a name="references"></a>

## 9. References

- Allen, R.G., L.S. Pereira, D. Raes, and M. Smith. 1998. Crop evapotranspiration: Guidelines for computing crop water requirements, FAO Irrigation and Drainage Paper No. 56.

- Doorenbos, J. and Kassam, A.H., 1979. FAO irrigation and drainage paper No. 33 “Yield response to water”. FAO–Food and Agriculture Organization of the United Nations, Rome.

- Lollato, R.P. and Edwards, J.T., 2015. Maximum attainable wheat yield and resource‐use efficiency in the southern Great Plains. Crop Science, 55(6), pp.2863-2876.

- Raun, W., Figueiredo, B., Dhillon, J., Fornah, A., Bushong, J., Zhang, H. and Taylor, R., 2017. Can yield goals be predicted?. Agronomy Journal, 109(5), pp.2389-2395.
  

<a name="version"></a>

<br/><br/>
*ForecastDualKc version 0.4 - Last updated: 13-Mar-2021 - MIT License*
