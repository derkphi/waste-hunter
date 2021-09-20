import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid, Button, Dialog, DialogContent, DialogTitle, DialogActions } from '@material-ui/core';
import { EventWithId } from '../common/firebase_types';
import BasicMap from '../components/maps/basicMap';
import MapPolygon from './maps/mapPolygon';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Routes } from '../components/customRoute';
import { useHistory } from 'react-router-dom';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton, Box } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: '20px',
    },
    mapGridItem: {
      width: '100%',
      height: '350px',
      padding: '1px',
    },
    iconStart: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)' },
  })
);

interface EventCardProps {
  event: EventWithId;
  joinEnabled: boolean;
  showEditDelete?: boolean;
  deleteClick?: (id: string) => void;
}

function EventCard(props: EventCardProps) {
  const history = useHistory();
  const classes = useStyles();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <Card className={classes.root}>
      <CardHeader title={new Date(props.event.datum).toLocaleDateString('de-CH') + ' - ' + props.event.anlass} />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item sm={12} md={6} className={classes.mapGridItem}>
            <BasicMap viewport={props.event.position}>
              {props.event.searchArea && <MapPolygon data={props.event.searchArea} />}
              <LocationOnOutlinedIcon fontSize="large" color="primary" className={classes.iconStart} />
            </BasicMap>
          </Grid>
          <Grid item sm={12} md={6}>
            <Typography paragraph variant="h6">
              Treffpunkt bei {props.event.ort} um {props.event.zeit} Uhr
            </Typography>
            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                color="secondary"
                variant="contained"
                endIcon={<KeyboardArrowRightIcon />}
                disabled={!props.joinEnabled}
                onClick={() => history.push(Routes.cleanup.replace(':id', props.event.id))}
              >
                Teilnehmen
              </Button>
              {props.showEditDelete && (
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => history.push(Routes.editEvent.replace(':id', props.event.id))}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => setShowDialog(true)}>
                    <DeleteForeverIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)} style={{ zIndex: 3000 }}>
        <DialogTitle>Event löschen?</DialogTitle>
        <DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={() => setShowDialog(false)}>
              Abbrechen
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setShowDialog(false);
                props.deleteClick && props.deleteClick(props.event.id);
              }}
            >
              Löschen
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default EventCard;
