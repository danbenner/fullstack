/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Grid,
  Typography,
} from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  content: {
    alignItems: 'center',
    display: 'flex',
  },
  title: {
    // fontSize: '2em',
    fontSizeAdjust: 0.5,
  },
  statistics: {
    marginTop: theme.spacing(2),
    display: 'grid',
    alignItems: 'center',
    marginRight: theme.spacing(1),
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  positiveIcon: {
    color: '#00FF7F',
  },
  negativeIcon: {
    color: '#DC143C',
  },
  change: {
    marginRight: theme.spacing(1),
  },
  caption: {
    marginRight: theme.spacing(1),
  },
}));

const CustomCard = (props) => {
  const {
    className, cardTitle, mainData, stats,
  } = props;

  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
        >
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              {cardTitle}
            </Typography>
            <Typography variant="h4">{mainData}</Typography>
          </Grid>
        </Grid>
        <div className={classes.statistics}>
          {stats.map((stat) => (
            <Grid item className={classes.stat}>
              {
                (Number(stat.change) > 0)
                  ? <ArrowUpwardIcon className={classes.positiveIcon} />
                  : <ArrowDownwardIcon className={classes.negativeIcon} />
              }
              <Typography
                className={classes.change}
                variant="body2"
              >
                {stat.change}%
              </Typography>
              <Typography
                className={classes.caption}
                variant="caption"
              >
                {stat.details}
              </Typography>
            </Grid>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
