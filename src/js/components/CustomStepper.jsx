import React from 'react';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';

const styles = {
  margin: 'auto',
  display: 'inline-grid',
  fontSize: '3em',
  borderRadius: '15px',
};

export default function CustomStepper(props) {
  const { activeStep, labels } = props;
  return (
    <Paper>
      <Stepper style={styles} activeStep={activeStep} orientation="vertical">
        { props.getSteps().map((comp, index) => (
          <Step key={comp}>
            <StepLabel><b>{labels[index]}</b></StepLabel>
            <StepContent TransitionProps={{ in: true }}>
              {comp}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
}
