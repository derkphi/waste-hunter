import React, { useEffect, useState } from 'react';
import { UserWithId } from '../../firebase/types';
import { database } from '../../firebase/config';
import { Typography, Box, makeStyles } from '@material-ui/core';
import beaver from '../../assets/beaver.png';
import bee from '../../assets/bee.png';
import cat from '../../assets/cat.png';
import chicken from '../../assets/chicken.png';
import cow from '../../assets/cow.png';
import deer from '../../assets/deer.png';
import fox from '../../assets/fox.png';
import owl from '../../assets/owl.png';
import sheep from '../../assets/sheep.png';

const purple = '#d9b3d9';
const yellow = '#f7eeb3';
const blue = '#bbdeeb';
const green = '#c8e9d4';

const avatars = [
  { a: beaver, c: yellow },
  { a: bee, c: blue },
  { a: cat, c: green },
  { a: chicken, c: purple },
  { a: cow, c: green },
  { a: deer, c: purple },
  { a: fox, c: yellow },
  { a: owl, c: blue },
  { a: sheep, c: green },
];

const useStyles = makeStyles({
  userContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  avatarBox: {
    margin: '2px',
    width: '40px',
    height: '40px',
    padding: '6px',
    //borderRadius: '20px',
  },
  avatar: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  name: {
    marginLeft: '5px',
    fontSize: '20px',
  },
});

interface UserProps {
  uid: string;
}

function User(props: UserProps) {
  const classes = useStyles();
  const [user, setUser] = useState<UserWithId | undefined>(undefined);

  useEffect(() => {
    database
      .ref(`users/${props.uid}`)
      .get()
      .then((data) => {
        const userData = data.val();
        if (userData) {
          setUser({ ...data.val(), id: props.uid });
        } else {
          setUser({ firstName: '?', lastName: '', icon: 0, email: '', id: props.uid });
        }
      });
  }, [props.uid]);

  return (
    <>
      {user && (
        <Box className={classes.userContainer}>
          <Box className={classes.avatarBox} style={{ backgroundColor: avatars[user.icon % avatars.length].c }}>
            <img src={avatars[user.icon % avatars.length].a} alt="User avatar" className={classes.avatar} />
          </Box>
          <Typography key={user.id} className={classes.name}>
            {user.firstName} {user.lastName}
          </Typography>
        </Box>
      )}
    </>
  );
}

export default User;
