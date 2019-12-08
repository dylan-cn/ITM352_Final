import React, { useEffect, useState, useRef } from 'react';
import { Container, List, ListItem, ListItemText, Grid, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import socket from '../socket';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        height: '100%',
    },
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        height: 'auto',
        maxHeight: '50vh',
        overflow: 'auto',
    },
    inline: {
        display: 'inline',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
}));

export default function Test() {
    const [msgs, setMsgs] = useState([]);
    const [focus, setFocus] = useState(false);
    const msgEndRef = useRef(null);
    const msgList = useRef(null);

    useEffect(() => {
        socket.on('msg', (data) => {
            setMsgs(prevState => {
                return [...prevState, data];
            });
        });
    }, []);

    const scrollToBottom = () => {
        // Only scroll to bottom if list does not have focus or client has scrolled far enough up
        if (!focus && (msgList.current.scrollTop + msgList.current.clientHeight) > msgList.current.scrollHeight * 0.85)
            msgEndRef.current.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [msgs]);

    const classes = useStyles();

    function sendMsg(e) {
        e.preventDefault();
        const form = e.target;

        const msg = form.message.value;

        if (msg.trim().length > 0) {
            socket.emit('send', msg);
            form.message.value = '';
        }
    }

    return (
        <Container component="main">
            <div className={classes.paper}>
                <List ref={msgList} className={classes.root} onMouseEnter={() => setFocus(true)} onMouseLeave={() => setFocus(false)}>
                    {msgs.map((msg, idx) =>
                        <ListItem key={idx}>
                            <ListItemText
                                primary={msg}
                            />
                        </ListItem>
                    )}
                    <div ref={msgEndRef} />
                </List>
            </div>

            <form className={classes.form} noValidate onSubmit={sendMsg}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={11}>
                        <TextField
                            name="message"
                            variant="outlined"
                            required
                            fullWidth
                            id="message"
                            label="Message"
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={false}
                            className={classes.submit}
                        >
                            Send
                        </Button>
                    </Grid>

                </Grid>
            </form>
        </Container>
    );
}