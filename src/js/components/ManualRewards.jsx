import React from 'react';
import Cookies from 'universal-cookie';
import { Paper, LinearProgress } from '@material-ui/core';
import Eligibility from './Eligibility';
import Stepper from './CustomStepper';
import CustomTextField from './CustomTextField';
import CustomSelect from './CustomSelect';
import ReviewForm from './ReviewForm';
// ------------------------------------------------------------------//
// Get user's CN# & AD Groups
const cookies = new Cookies();
// NOTE: This allows for the removal of the only environment variable
const HOSTNAME = window && window.location && window.location.hostname;
// ------------------------------------------------------------------//
function checkHostname(hostname) {
  if (hostname === '127.0.0.1' || hostname === 'localhost') {
    // console.log(`Hostname: ${hostname}`);
    return 'http://127.0.0.1:8081/'; // root url to loyalty-rewards-api (local instance)
  } if (hostname === 'fullstack.ckp-dev.centene.com') {
    // console.log(`Hostname: ${hostname}`);
    return 'https://fullstack.ckp-dev.centene.com/'; // (POTS - dev instance)
  } if (hostname === 'fullstack.ckp-test.centene.com') {
    // console.log(`Hostname: ${hostname}`);
    return 'https://fullstack.ckp-test.centene.com/'; // (POTS - test instance)
  } if (hostname === 'fullstack.ckp.centene.com') {
    // console.log(`Hostname: ${hostname}`);
    return 'https://fullstack.ckp.centene.com/'; // (POTS - prod instance)
  }
  // DEFAULT
  // console.log(`Hostname: ${hostname}`);
  return 'http://127.0.0.1:8081/';
}
// ------------------------------------------------------------------//
function getProgramUnit(pUnit) {
  if (pUnit === 'MEDICAID') {
    return 1;
  }
  if (pUnit === 'MARKETPLACE') {
    return 2;
  }
  if (pUnit === 'MEDICARE') {
    return 3;
  }
  // else
  return 0;
}
// ------------------------------------------------------------------//

const paper = {
  margin: 'auto',
  display: 'inline-grid',
};

class ManualRewards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0, // render() contains a MaterialUI object called a 'stepper'
      forceChildReset: 0, // used in getSteps return -> Eligibility 'key' (which is a keyword)
      eligibility: { // this property is directly passed back from the child Eligibility Component
        state: '',
        product: '',
        plan: 0, // plandimck
        rewardPlanID: 0,
        memberID: '',
        eligible: false,
      },
      name: '',
      dob: '',
      disabled: true,
      rewardsDisable: true,
      rewardsErrorMessage: '',
      amounts: [],
      legacyIDs: [],
      rewardSelection: '',
      actualRewardAmount: 0,
      displayRewardAmount: '',
      rewardOptions: [],
      loading: false,
      hideSubmit: true,
      submitError: '',
      portalUserCN: cookies.get('userID'),
    };
    this.getSteps = this.getSteps.bind(this);
    this.changeStep = this.changeStep.bind(this);
    this.clearFormRewardAndReview = this.clearFormRewardAndReview.bind(this);
    this.updateForm = this.updateForm.bind(this);
    this.fetchRewardOptions = this.fetchRewardOptions.bind(this);
    this.handleReward = this.handleReward.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.unHideSubmit = this.unHideSubmit.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  getSteps() {
    const {
      forceChildReset,
      eligibility,
      rewardsDisable,
      rewardsErrorMessage,
      rewardSelection,
      displayRewardAmount,
      rewardOptions,
      loading,
      hideSubmit,
      submitError,
    } = this.state;
    const { name, dob, disabled } = this.state;
    const flex = {
      display: 'flex',
      flexDirection: 'row',
    };
    /*
      NOTE: I had to make this an 'array' because it was being
      returned as an object, so .map() wouldn't work.
    */
    return (
      [
        <Eligibility
          key={forceChildReset}
          eligibility={eligibility}
          changeStep={this.changeStep}
          clearFormRewardAndReview={this.clearFormRewardAndReview}
          updateForm={this.updateForm}
        />,
        <div style={flex}>
          <CustomSelect
            datatest="reward-select"
            disabled={rewardsDisable}
            value={rewardSelection}
            handler={this.handleReward}
            options={rewardOptions}
            helperText={rewardsErrorMessage}
            placeholder="Reward"
          />
          <CustomTextField disabled value={displayRewardAmount} placeholder="$" fontsize="4em" />
        </div>,
        <div>
          <ReviewForm
            datatest="review-form"
            name="Review"
            formValues={{
              eligibility,
              name,
              dob,
              rewardSelection,
              disabled,
            }}
            hide={hideSubmit}
            onClick={this.handleFormSubmit}
            helperText={submitError}
          />
          {loading && <LinearProgress />}
        </div>,
      ]
    );
  }

  changeStep(step) {
    switch (step) {
      case 0:
        this.setState(() => ({
          activeStep: step,
          name: '',
          dob: '',
          rewardsDisable: true,
          rewardSelection: '',
          actualRewardAmount: 0,
          displayRewardAmount: '',
          rewardOptions: [],
          disabled: true,
          hideSubmit: true,
          submitError: '',
        }));
        break;
      case 1:
        this.setState(() => ({
          activeStep: step,
          rewardsDisable: false,
          hideSubmit: true,
        }));
        break;
      case 2:
        this.setState(() => ({
          activeStep: step,
          hideSubmit: false,
        }));
        break;
      default:
    }
  }

  clearFormRewardAndReview() {
    this.setState(() => ({
      name: '',
      dob: '',
      rewardSelection: '',
      rewardsErrorMessage: '',
    }));
  }

  updateForm(state, product, plan, rewardPlanID, memberID, eligible, name, dob) {
    this.setState(() => ({
      activeStep: 1,
      eligibility: {
        state,
        product,
        plan,
        rewardPlanID,
        memberID,
        eligible,
      },
      name,
      dob,
      loading: true,
    }), this.fetchRewardOptions);
  }

  // NOTE: should fetch the whole models.Reward or this special array type I have below
  fetchRewardOptions() {
    const { eligibility } = this.state;
    const BASEURL = checkHostname(HOSTNAME);
    // console.log(`BASEURL: ${BASEURL}`);
    fetch(BASEURL.concat('rewards/', eligibility.rewardPlanID))
    // fetch('http://httpstat.us/500')
      .then((response) => response.json())
      .then((data) => {
        const { results } = data;
        this.setState({
          rewardsDisable: false,
          rewardsErrorMessage: '',
          amounts: results.Amounts,
          legacyIDs: results.IDs,
          rewardOptions: Object.keys(results.Amounts), // Object.values(data),
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          rewardsErrorMessage: error.toString(),
        });
      });
  }

  handleReward(selected) {
    const { amounts } = this.state;
    this.setState(() => ({
      rewardSelection: selected.target.value,
      actualRewardAmount: amounts[selected.target.value],
      displayRewardAmount: `$${amounts[selected.target.value]}`,
      disabled: false,
    }), this.changeStep(2));
  }

  // eslint-disable-next-line class-methods-use-this
  notifySuccess() {
    // eslint-disable-next-line no-alert
    alert('Manual Reward Success!');
  }

  // eslint-disable-next-line class-methods-use-this
  notifyError(err) {
    // eslint-disable-next-line no-alert
    alert(`Failed to Submit Reward. Server Unavailable:${err}`);
  }

  handleClearForm() {
    this.setState((prevState) => ({
      // This is modifying the 'key' of the child component 'Eligibility'
      // It forces the child to be entirely recreated with a new 'key'
      forceChildReset: (prevState.forceChildReset + 1),
      eligibility: {
        state: '',
        product: '',
        plan: '',
        rewardPlanID: '',
        memberID: '',
        eligible: false,
      },
      name: '',
      dob: '',
      submitError: '',
    }), this.changeStep(0));
  }

  unHideSubmit() {
    this.setState({
      hideSubmit: false,
    });
  }

  handleFormSubmit() {
    const {
      eligibility, actualRewardAmount, legacyIDs, rewardSelection, portalUserCN,
    } = this.state;
    const payload = JSON.stringify({
      planUnit: eligibility.rewardPlanID,
      programUnit: getProgramUnit(eligibility.product),
      memberAmisysNbr: eligibility.memberID,
      rewardID: legacyIDs[rewardSelection], // amounts[rewardSelection], // rewardPlanID
      insertTSP: 'CURRENT_TIMESTAMP', // NOTE: using SQL KEYWORD: 'CURRENT_TIMESTAMP' in POST
      rewardAmount: actualRewardAmount,
      loadFlag: 'N', // NOTE: This is a constant
      createdBy: portalUserCN,
    });
    const BASEURL = checkHostname(HOSTNAME);
    fetch(BASEURL.concat('PostError/'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: payload,
    })
      .catch((error) => {
        this.handleClearForm();
        this.notifyError(error);
      })
      .then(this.handleClearForm(), this.notifySuccess());
  }

  render() {
    const { activeStep } = this.state;
    const labels = ['Eligibility Check', 'Select Reward', 'Review'];
    return (
      <Paper style={paper}>
        <Stepper activeStep={activeStep} getSteps={this.getSteps} labels={labels} orientation="vertical" />
      </Paper>
    );
  }
}

// export default connect(mapStateToProps, {fetchPosts})(App);
export default ManualRewards;
