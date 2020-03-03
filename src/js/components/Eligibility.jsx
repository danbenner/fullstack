/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import CustomTextField from './CustomTextField';
import CustomSelect from './CustomSelect';
import { stateOptions, productOptions } from './options';

// ------------------------------------------------------------------//
// NOTE: This allows for the removal of the only environment variable
// const HOSTNAME = window && window.location && window.location.hostname;
// ------------------------------------------------------------------//
function checkHostname(hostname) {
  if (hostname === '127.0.0.1' || hostname === 'localhost') {
    return 'http://127.0.0.1:8081/';
  } if (hostname === 'fullstack.dev.com') {
    return 'https://fullstack.dev.com/';
  } if (hostname === 'fullstack.test.com') {
    return 'https://fullstack.test.com/';
  } if (hostname === 'fullstack.com') {
    return 'https://fullstack.com/';
  }
  // DEFAULT
  return 'http://127.0.0.1:8081/';
}
// ------------------------------------------------------------------//

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

class Eligibility extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateSelection: '',
      stateOptions,
      productSelection: '',
      productOptions,
      planDisable: true,
      planErrorMessage: '',
      planSelection: '',
      planOptions: [],
      pdimck: 0, // PlanDimCK
      plans: [], // map[PlanDimCK]RewardPlanName
      rewardPlanID: 0,
      memberID: '',
      memberIdError: false,
      memberIDErrorMessage: '',
      error: false,
      message: '',
      loading: false,
    };
    this.getKeyByValue = this.getKeyByValue.bind(this);
    this.handleStateSelect = this.handleStateSelect.bind(this);
    this.handleProductSelect = this.handleProductSelect.bind(this);
    this.fetchPlanOptions = this.fetchPlanOptions.bind(this);
    this.setRewardPlanID = this.setRewardPlanID.bind(this);
    this.parseRewardPlans = this.parseRewardPlans.bind(this);
    this.handlePlanSelect = this.handlePlanSelect.bind(this);
    this.handleMemberIDChange = this.handleMemberIDChange.bind(this);
    this.handleEligibility = this.handleEligibility.bind(this);
    this.fetchEligibility = this.fetchEligibility.bind(this);
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  // Loop through plans[], set rewardPlanName when matching selected
  setRewardPlanID(rPlans, selected) {
    let i;
    for (i = 0; i < rPlans.length; i++) {
      if (rPlans[i].rewardPlanName === selected) {
        return rPlans[i].rewardPlanID;
      }
    }
    return 0;
  }

  parseRewardPlans(rPlans) {
    let i;
    const tempArray = [];
    for (i = 0; i < rPlans.length; i++) {
      tempArray.push(rPlans[i].rewardPlanName);
    }
    this.setState({
      planOptions: tempArray,
      pdimck: rPlans[0].PlanDimCK,
    });
  }

  handleStateSelect(selected) {
    this.setState({
      stateSelection: selected.target.value,
      planDisable: true,
      planErrorMessage: '',
      planSelection: '',
      message: '',
      memberIDErrorMessage: '',
      error: false,
    }, () => {
      if (this.state.productSelection !== '') {
        this.props.clearFormRewardAndReview();
        this.props.changeStep(0);
        this.setState({ loading: true });
        this.fetchPlanOptions(this.state.productSelection, this.state.stateOptions[this.state.stateSelection]);
      }
    });
  }

  handleProductSelect(selected) {
    this.setState(() => ({
      productSelection: selected.target.value,
      planDisable: true,
      planErrorMessage: '',
      planSelection: '',
      message: '',
      memberIDErrorMessage: '',
      error: false,
    }), () => {
      if (this.state.stateSelection !== '') {
        this.props.clearFormRewardAndReview();
        this.props.changeStep(0);
        this.setState({ loading: true });
        this.fetchPlanOptions(this.state.productSelection, this.state.stateOptions[this.state.stateSelection]);
      }
    });
  }

  // NOTE: ***need to decide wether we fetch FROM the Frontend or the Server***
  fetchPlanOptions(product, stateInitials) {
    const BASEURL = checkHostname(window.location.hostname);
    const url = BASEURL.concat('products/', product, '/plans/', stateInitials);
    fetch(url)
      .then(handleErrors)
      .then((response) => response.json())
      .then((data) => {
        const { results } = data;
        // const err = data['error'];
        if (Object.keys(results).length !== 0) {
          this.setState({ planDisable: false });
        }
        this.setState({
          planErrorMessage: '',
          plans: Object.values(results),
          loading: false,
        });
        this.parseRewardPlans(this.state.plans);
      })
      .catch((error) => {
        let str = error.toString();
        if (error.toString() === 'TypeError: Failed to fetch') {
          str = 'Failed to fetch Plans: Connection Unavailable';
        } else if (error.toString() === 'TypeError: Failed to execute \'fetch\' on \'Window\'') {
          str = 'Fetch failed!';
        } else if (error.toString().includes('null')) {
          str = 'Plan Does Not Exist';
        }
        this.setState({
          loading: false,
          planErrorMessage: str,
        });
      });
  }

  handlePlanSelect(selected) {
    this.props.clearFormRewardAndReview();
    this.props.changeStep(0);
    const id = this.setRewardPlanID(this.state.plans, selected.target.value);
    if (this.state.memberID !== '' && !this.state.memberIdError) {
      this.setState(() => ({
        planSelection: selected.target.value,
        rewardPlanID: id,
        message: '',
        memberIDErrorMessage: '',
      }), this.handleEligibility);
    } else {
      this.setState(() => ({
        planSelection: selected.target.value,
        rewardPlanID: id,
        message: '',
        memberIDErrorMessage: '',
      }));
    }
  }

  handleMemberIDChange(e) {
    const memberIdRegex = /(^[u|U|c|C]\d{10}$|^[0-9]{11}$)/;
    const passing = memberIdRegex.test(e.target.value);
    this.props.clearFormRewardAndReview();
    this.props.changeStep(0);
    if (passing) {
      this.setState({
        memberID: e.target.value,
        memberIdError: !passing,
        error: !passing,
        memberIDErrorMessage: '',
        message: '',
      }, this.handleEligibility);
    } else {
      this.setState({
        memberID: e.target.value,
        memberIdError: passing,
        error: passing,
        memberIDErrorMessage: '',
        message: 'invalid input',
      });
    }
  }

  // NOTE: 2 options: NOT FOUND and/or NOT Eligible (possibly include 45 day)
  // BASED ON UMV'S REAL RESPONSE CODE
  handleEligibility() {
    const {
      stateSelection, productSelection, planSelection, rewardPlanID, memberID, memberIdError, error,
    } = this.state;
    if (
      stateSelection !== ''
      && productSelection !== ''
      && planSelection !== ''
      && rewardPlanID !== ''
      && memberID !== ''
      && memberIdError !== true
      && error !== true
    ) {
      this.setState(() => ({
        loading: true,
        message: '',
      }), this.fetchEligibility);
    }
  }

  fetchEligibility() {
    // console.log('state: ', this.state.stateSelection);
    // console.log('product: ', this.state.productSelection);
    // console.log('plan: ', this.state.planSelection);
    // console.log('pdimck: ', this.state.pdimck);
    // console.log('rewardPlanID: ', this.state.rewardPlanID);
    // console.log('memberID: ', this.state.memberID);
    const BASEURL = checkHostname(window.location.hostname);
    const result = BASEURL.concat('plans/', this.state.pdimck, '/members/', this.state.memberID, '/eligible');
    fetch(result)
      .then(handleErrors)
      .then((response) => response.json())
      .then((data) => {
        const err = data.error;
        if (err === undefined) {
          this.setState({
            error: false,
            message: 'Eligible for the product in this state. '
              + 'Please verify the plan before submitting.',
            memberIDErrorMessage: '',
            loading: false,
          },
          this.props.updateForm(this.state.stateSelection, this.state.productSelection, this.state.pdimck, this.state.rewardPlanID, this.state.memberID, false, data.name, data.dob));
        } else if (err.message === 'Not Eligible') {
          this.setState(() => ({
            error: true,
            message: 'Not Eligible',
            memberIDErrorMessage: '',
            loading: false,
          }));
        } else {
          if (data.error.status !== undefined && data.error.status === 500) {
            this.setState(() => ({ message: 'Error Finding ID' }));
          } else if (data.error.status !== undefined && data.error.status === 404) {
            this.setState(() => ({ message: 'Member Not Found' }));
          }
          this.setState(() => ({
            error: true,
            memberIDErrorMessage: '',
            loading: false,
          }));
        }
      })
      .catch((error) => {
        const str = error.toString();
        if (str === 'TypeError: Failed to fetch') {
          this.setState({
            loading: false,
            memberIDErrorMessage: 'Failed to fetch Eligibility: Connection Unavailable',
          });
        } else {
          this.setState({
            loading: false,
            memberIDErrorMessage: 'Member Not Found',
          });
        }
      });
  }

  render() {
    const {
      stateSelection,
      productSelection,
      planDisable,
      planErrorMessage,
      planSelection,
      memberID,
      memberIDErrorMessage,
      loading,
      message,
      error,
    } = this.state;

    const labels = ['State', 'Product', 'Plan', 'Member ID'];
    return (
      <form data-test="eligibility">
        <div>
          <CustomSelect
            datatest="state-select"
            value={stateSelection}
            handler={this.handleStateSelect}
            options={Object.keys(this.state.stateOptions)}
            placeholder={labels[0]}
          />
          <CustomSelect
            datatest="product-select"
            value={productSelection}
            handler={this.handleProductSelect}
            options={this.state.productOptions}
            placeholder={labels[1]}
          />
          <CustomSelect
            datatest="plan-select"
            disabled={planDisable}
            value={planSelection}
            handler={this.handlePlanSelect}
            options={this.state.planOptions}
            helperText={planErrorMessage}
            placeholder={labels[2]}
          />
          <CustomTextField
            datatest="memberAmisysNumber-text-field"
            error={error}
            value={memberID}
            message={message + memberIDErrorMessage}
            onChange={this.handleMemberIDChange}
            label="Member Amisys Number"
          />
          {loading && <LinearProgress />}
        </div>
      </form>
    );
  }
}

Eligibility.defaultPropTypes = {
  stateSelection: '',
  productSelection: '',
  planDisable: true,
  planErrorMessage: '',
  planSelection: '',
  memberID: '',
  memberIDErrorMessage: '',
  loading: false,
  message: '',
  error: false,
};

export default Eligibility;

/**
  type RewardPlan struct {
    ActiveIndicator        bool      `json:"activeIndicator" bson:"ActiveIndicator"`
    DaysForEnrollment      int       `json:"daysForEnrollment" bson:"DaysForEnrollment"`
    DaysForTermination     int       `json:"daysForTermination" bson:"DaysForTermination"`
    EmployerID             string    `json:"employerID" bson:"EmployerID"`
    HealthPlanID           string    `json:"healthPlanID" bson:"HealthPlanID"`
    InsertTimestamp        time.Time `json:"insertTimestamp" bson:"InsertTimestamp"`
    LastUpdateTimestamp    time.Time `json:"lastUpdateTimestamp" bson:"LastUpdateTimestamp"`
    MedagatePlanID         string    `json:"medagatePlanID" bson:"MedagatePlanID"`
    PlanDimCK              int       `json:"PlanDimCK" bson:"PlanDimCK"`
    PlanStartDate          time.Time `json:"planStartDate" bson:"PlanStartDate"`
    PlanYearEffectiveMonth string    `json:"planYearEffectiveMonth" bson:"PlanYearEffectiveMonth"`
    ProductCode            string    `json:"productCode" bson:"ProductCode"`
    PurseID                string    `json:"purseID" bson:"PurseID"`
    RewardPlanID           int       `json:"rewardPlanID" bson:"RewardPlanID"`
    RewardPlanName         string    `json:"rewardPlanName" bson:"RewardPlanName"`
    StateCode              string    `json:"stateCode" bson:"StateCode"`
    TPAID                  string    `json:"TPAID" bson:"TPAID"`
    UMVBusinessUnit        int       `json:"UMVBusinessUnit" bson:"UMVBusinessUnit"`
  }
 */
