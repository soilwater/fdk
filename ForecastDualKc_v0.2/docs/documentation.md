# ForecastDualKc Docs

ForecastDualKc is a simple in-season soil water balance ensemble prediction tool capable of generating field-specific projections of soil moisture conditions, crop water use, and probable yield outcomes based on current crop conditions and historical weather records. The model is largely based on the Food and Agricultural Organization Irrgiation and Drainage Paper #56 dual crop coefficient method (Allen et al., 1998) and is aimed at anyone interested in using an interactive tool to visualize plausible crop water use scenarios and inform in-season management decisions.

Table of Contents

- [Model features](#features)
- [Model modifications](#modifications)
- [Inputs](#inputs)
  - [Soil](#inputs-soil)
  - [Plant](#inputs-plant)
  - [Atmosphere](#inputs-atmosphere)
- [Technical description](#technical-description)
- [Datasets](#datasets)
- [To-Do List](#to-do-list)
- [Dependencies](#dependencies)
- [Team](#team)
- [References](#references)
- [Version](#version)
- [Reading model outputs with Matlab](read_outputs_matlab.html)

<a name="features"></a>

## 1. Features of the User Interface

- No need for software download or installation. The tool is ready to use as soon as you load the website
  
- No shared data with the developers of remote servers. Everything you do remains private in your local computer.
  
- No log in credentials and no need to remember another password.
  
- Interactive and responsive user interface. Model results update in real time making it easy to fine tune the model and visualize a range of possible outcomes.
  
- Descriptive and human-readable input variables.
  
- Allows for direct assimilation of canopy cover and soil moisture obseravtions.

<a name="modifications"></a>

## 2. Model Modifications

Feature|FAO-56|ForecastDualKc
:---|:---|:---
`Basal crop coefficient`|Based on calendar days|Based on thermal units
`Fraction of canopy cover`|Estimated from the crop coefficients and plant height|Simulated using a simple model as a function of thermal units
`Crop stages`|Calendar days|Cumulative thermal units
`Timing of initial canopy cover computation`| From planting|From emergence

>Similarly to the dual crop coefficient method described in the FAO-56 publication, this model also errs on the side of simplicity. This means that some complex biological (e.g.phenology, root growth, canopy growth) and soil physical processes (e.g. infiltration, soil water redistribution) are simulated using simplified approaches that may not always be accurate. However, the model uncertainty due to model simplifications should be partially masked by the year-to-year variability of the projected scenarios.

<a name="inputs"></a>

## 3. Inputs

The model require inputs about basic soil physical properties, timing of the most important phenological stages, historical weather records, and basic management information.

<a name="inputs-soil"></a>

### 3.1 Soil

Property|Units|Typical Range|Description
:---|:---:|:---:|:---
`Depth surface layer`|m|0.10-0.20| Thickness of the top of soil layer primarily subjected to evaporative losses.
`Readily evaporable water`|m|0.30-0.50 | Fraction of the total evaporable water that is subjected to stage 1 evaporation.
`Initial surface soil moisture`|$m^3/m^3$|0.20-0.25|Soil water content in the surface layer at the beginning of the simulation
`Initial rootzone soil moisture`|$m^3/m^3$|0.20-0.35|Soil water content in the rootzone at the beginning of the simulations
`Lower limit`|$m^3/m^3$|0.05-0.20|Permanent wilting point (-1500 kPa). Strongly dependent on the soil texture
`Upper limit`|$m^3/m^3$|0.25-0.35|Field capacity (-10 kPa). Strognly dependent in soil texture, structure, and organic matter content.
`Residue cover`|Percentage|0-100|Percent of the soil surface covered with crop stubble. Strongly dependent on the tillage system.
`Fraction area wetted by irrigation`|Unitless|0.2-1.0|Fraction of the soil surface wetted by an irrigation system. Sprinklers (1.0), sub-surface drip irrigation(0.2).
`Curve number`|Unitless|75-92|USDA Soil Conservation Service curve number for estimating runoff. Higher numbers indicate higher runoff.

>We suggest using upper limit values corresponding to a matric potential of -10 kPa instead of -33 kPa. From experience, it seems that the value at -33 kPa tends to underestimate the amount of soil water remaining and available to plants after wetting events.

<a name="inputs-plant"></a>

### 3.2 Plant

Property|Units|Typical Range|Description
:---|:---:|:---:|:---
`Stage:Emergence`|C-day|100-150|Number of thermal units from sowing to emergence
`Stage: Initial`|C-day|400-1000|Number of thermal units from emergence to end of the initial stage (typically the period with canopy cover <10%-20%)
`Stage:Development`|C-day|800-1400|Number of thermal units to reach peak canopy cover. Typically the end of the vegetative period (e.g. flag leaf)
`Stage:Middle stage`|C-day|1500-2200|Number of thermal units that the crop remains at maximum canopy cover. Typically most of the reproductive stage.
`Stage:Late`|C-day|2000-2500|Thermal units from physiological maturity or end of grain/fruit filling period to harvest.
`Dormant period`|C-day|Winter time|Optional calendar period in which crops may experience dormancy (e.g. vernalization). During this stage $K_{cb} = K_{cmin}$ under the assumption plant trasnpiration is reduced to minimum and that most water losses during the dormant period are dominated by soil evaporation.
`Kcb ini`|Unitless|0-0.4|Initial basal crop coefficient. It might be higher that the suggested values for perennial crops.
`Kcb mid`|Unitless|0.8-1.20|Mid-season basal crop coefficient at or near peak canopy cover.
`Kcb late`|Unitless|0.9-1.2|Late-season basal crop coefficient.
`Tbase`|Celsius|0-10|Base temperature for crop development
`Tupper`|Celsius|32-40|Upper temperature for crop development
`Maximum plant height`|m|1.0-2.0|Maximum plant height during the growing season. For most agricultural crops the time of max plant height matches the end of the vegetative growth period.
`Maximum root depth`|m|1.0-3.0|Maximum root depth during the growing season. For most agricultural crops the time of max root depth matches the end of the vegetative growth period.
`pTab`|Unitless|0.3-0.7|Fraction of the total plant available water readily available to plant roots. Lower values imply higher susceptibility to soil water stress.
`Yield response factor`|Unitless|0.9-1.5|An empirical coefficient that relates the reduction in terms of relative yield to the reduction in ETc/ETo as a consequence of seasonal soil water deficits.
`Yield potential`|Mg/ha|3.0-8.0|Field-specific potential yield assuming no water limitations during the growing season.

>The timing of the crop stages can be highly affected by the choice of base temperature. For instance, it is widely assumed that winter wheat has a Tbase of 0 Celsius. However, values of Tbase=1 or Tbase=2 can sometimes result in better prediction of phenological stages and canopy cover.

<a name="inputs-atmosphere"></a>

### 3.3 Atmosphere

In light of uncertain future environmental conditions, historical weather observations constitute the source of plausible scenarios for the model. Past weather records provide a reliable source for projecting growing season scenarios and enable end users to compare the projection of the current growing season with past wet and dry years in the region. The approach used by ForecastDualKc accounts for more than "wetter than average" or "drier than average" conditions. By using actual past weather scenarios the model accounts for the timing and amount fo precipitation events.

Atmospheric observations are required in two diferent model inputs: `Climate` and `Observations`.

`Observations` represent the atmospheric observations from the beginning of the growing season until the present time. This information can be obtained from a regional weather network or from a simple weather station deployed in the field under simulation. While varaibles such as air temperature typically present low spatial varaibility, variables like precipitation can exhibit large spatial varaibility and obtaining precipitation from a station several miles from the field may substatnially impact the soil water balance. 

> The soil water balance is highly sensitive to water inputs. We recommend using accurate precipitation (and irrigation) infromation collected either at the site or from a nearby automated weather station.

    Headers of observations (order matters)
    
    year | month | day| tempMax | tempMin |rhMax | rhMin | precip | solarRad | windSpeed | surfaceSoilMoistureObs | rootzoneSoilMoistureObs | canopyCoverObs

`Climate` refers to long-term (>10 years) of weather data used for the forecasting component from the present time to an estiamted end of the growing season based on thermal units. Climate records do not necessarily need to be for the field under simulation. Climate records from an environmental monitoring station in the county or agrciultural climate division should provide enough information about plausible scenarios. Even stations at about 75 km (~50 miles) should provide valuable data.

    Headers of climate file (order matters)
    
    year | month | day| tempMax | tempMin |rhMax | rhMin | precip | solarRad | windSpeed

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
`precip`|mm| Daily total precipitation
`solarRad`| MJ/$m^2$/day| Incident solar radiation
`windSpeed`|m/s| Daily average wind speed

#### Table of field observations

Variable|Units|Description
:---|:---:|:---
`surfaceSoilMoistureObs`|mm|Observed soil moisture in the surface layer. The amount of water needs to be observed in the same soil depth selected in the model
`rootzoneSoilMoistureObs`|mm|Observed soil moisture in the surface layer. The amount of water needs to be observed in the same soil depth selected in the model
`canopyCoverObs`|%|Observed green canopy cover

<a name="technical-description"></a>

## 4. Technical Description

The model is based on the FAO-56 Dual Crop Coefficient (Dual Kc) method (Allen et al 1998). The model relies on grass reference evapotranspiration and a set of crop coefficients that partition transpirational and evaporative losses. While the model closely follows the specifications in the FAO-56 manual, few minor modifications were introduced to enable the assimilation of field observations of green canopy cover and soil moisture from users. In this version, the basal crop coefficients (Kcb) are not determined following the traditional piecesewise linear model, but rather as a function of the fraction of green canopy cover. This not only enables a continuous and more natural shape of the crop coefficients, but also allows end users to correct the model with field observations. A simple canopy growth model was introduced to simulate canopy growth between observations.

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

Canopy cover ($C$) is modeled as a function of daily thermal units ($TU$). The model basically scales the range in canopy cover between the time of emergence and the end of the development stage. This approach provides a first order approximation that provides acceptable performance to partition the fraction of evaporable water. To improve the accuracy of the canopy cover model we suggest collecting and assimilating observations of green canopy cover. During the development stage, canopy growth is modeled as follows:

$$ C_t = C_{t-1} + \frac{TU_t}{TU_{dev}} $$

During the late stage, the decline in green canopy cover as a result of crop senescence is modeled proportional to the $K_{cb late}$:

$$ C_t = C_{t-1} + (K_{cb \ t} - K_{cb \ t-1})$$

### 4.4 Actual crop evapotrasnpiration

Actual crop evapotranspiration under soil water deficit conditions ($ET_a$) is modeled as the sum of the basal ($K_{cb}$) and evaporation ($K_e$) crop coefficients. In scenarios where plants are subjected to soil water deficit, crop evapotrasnpiration is modulated by a stress factor that is linearly related to the remaining amount of plant available water in the rootzone:

$$ ET_a = ET_o \ (K_{cb} K_s + K_e)$$

### 4.5 Soil water balance computation

The resulting soil water balance for the rootzone is computed by taking into account the main inputs and outputs of agricultural fields. The soil water deficit (or depletion) is computed as follows:

$$Dr_t = Dr_{t-1} - (P_t - RO_t) - I_t + ET_{a \ t} + DPr_t$$

$Dr$ is the depletion of the rootzone

$P$ is daily precipitation

$RO$ is the estimated daily runoff

$I$ is the daily irrigation depth

$ETa$ is the daily actual crop evapotranspiration

$DPr$ is the deep percolation of the rootzone

### 4.6 ET Partitioning

The evaporation adn trasnpiration components of the crop ET are estimated by decoupling the basal and evaporation crop coefficients:

$$ E = (K_e + K_{cb \ diff}) \ ET_{ref}$$

$$ T = K_s \ (K_{cb} - K_{cb \ diff}) \ ET_{ref}$$

$T$ is crop transpiration

$E$ is soil evaporation

$K_{cb \ diff}$ are diffusive losses from the rootzone included in the basal crop coefficient (Lollato et al., 2016). The magnitude of iffusive lossses can be typically quantified in field conditions during several weeks without rainfall and vegetation.

### 4.7 Grain yield

Grain yield is approximated following th FAO Irrigation and Drainage Paper #33:

$$ \bigg( 1- \frac{Y_a}{Y_p} \bigg) = K_y \bigg(1- \frac{ET_a}{ET_c}\bigg)$$

$Y_a$ is the actual grain yield in Mg/ha

$Y_p$ is the potential yield in Mg/ha

$ET_a$ is the total actual crop evapotranspiration at the end of the growing season

$ET_c$ is the total crop evapotranspiration under non-stressed conditions at the end of the growing season

>This approach for estiamting crop yield only provides a first-order approximation assuming the use of sound yield potential values and that yield reductions are mainly caused by soil water stress. The error in yield estimation is assumed to be low compared to the year-to-year yield variabilty due to weather conditions.

<a name="datasets"></a>

## 5. Datasets

The model ships with an example dataset for winter wheat in Stillwater, OK during the 2012-2013 growing season. More information about the methods and observations can be found in the following manuscript:

Lollato, R.P. and Edwards, J.T., 2015. Maximum attainable wheat yield and resource‐use efficiency in the southern Great Plains. Crop Science, 55(6), pp.2863-2876.

<a name="to-do-list"></a>

## 6. To-Do List

- [x] Add figure showing ET partitioning
- [x] Add figure of cumulative yield probability
- [ ] Add table in documentation with soil physical properties for each soil textural class
- [ ] Add table in documentation with crop stages in terms of thermal units for common crops and maturity groups (e.g. wheat, soybeans, corn)
- [ ] Add curated datasets for winter and summer crops containing periodic observations of rootzone soil moisture and canopy cover. This datasets could be used to calibrate the model and provide new users a starting point.

<a name="dependencies"></a>

## 7. Model Dependencies

The core of the model model was implemented in Javascript and contains no external dependencies, but few external open source libraries were used to assist with the graphical user interface:

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

- Lollato, R.P., Patrignani, A., Ochsner, T.E. and Edwards, J.T., 2016. Prediction of plant available water at sowing for winter wheat in the Southern Great Plains. Agronomy Journal, 108(2), pp.745-757.

<a name="version"></a>

<br/><br/>
*ForecastDualKc version 0.2 - Last updated: 9-Nov-2020 - MIT License*
