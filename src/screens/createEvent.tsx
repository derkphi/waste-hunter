import React,{useState} from 'react';
import {TextField, Typography, makeStyles,FormLabel,Button} from "@material-ui/core";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import {Container} from "@material-ui/core";
import { useHistory } from 'react-router-dom'

const useStyles= makeStyles({
    field: {
        marginTop: 20,
        marginBottom: 20,
        display: 'block'
    }
})

function createEvent(){
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const classes=useStyles();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const history = useHistory()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [anlass, setAnlass] = useState('')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [ort, setOrt] = useState('')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [datum, setDatum] = useState('')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [zeit, setzeit] = useState('')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [anlasserror, setAnlasserror] = useState('')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [orterror, setOrterror] = useState('')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [datumerror, setDatumerror] = useState()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [zeiterror, setzeiterror] = useState()


    const handleSubmit = (e:any) => {
        e.preventDefault()
        //setAnlasserror(false)
        //setOrterror(false)
        //setDatumerror(false)
        //setzeiterror(false)
        //if (anlass == '') {
        //    setAnlasserror(true)
        //}
       // if (ort == '') {
        //    setOrterror(true)
        //}
        if (anlass && ort) {
            fetch('https://waste-hunter-default-rtdb.europe-west1.firebasedatabase.app/events.json', {
                method: 'POST',
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({ anlass, ort,datum,zeit })
            }).then(() => history.push('/Home'))
        }
    }




    return(
        <Container maxWidth="sm">
        <Typography
            variant="h6"
            color="textPrimary"
            component="h2"
            gutterBottom
        >
            Erfasse einen Event
        </Typography>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
<TextField
    className={classes.field}
    onChange={(e) => setAnlass(e.target.value)}
    label="Name Anlass"
    variant="outlined"
    color="secondary"
    fullWidth
    required>

</TextField>

                <FormLabel>Erfasse den Treffpunkt</FormLabel>

                <TextField
                    className={classes.field}
                    onChange={(e) => setOrt(e.target.value)}
                    label="Ort"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    required>

                </TextField>
            <TextField
                className={classes.field}
                onChange={(e) => setDatum(e.target.value)}
                //label="Datum"
                type="date"
                variant="outlined"
                color="secondary"
                fullWidth
                required>

            </TextField>
                <TextField
                    className={classes.field}
                    onChange={(e) => setzeit(e.target.value)}
                    //label="Zeit"
                    type="time"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    required>

                </TextField>
                <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    endIcon={<KeyboardArrowRightIcon />}>
                    Submit
                </Button>
            </form>
        </Container>

    )
}
export default createEvent;
