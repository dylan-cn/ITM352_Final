import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 345,
    },
    paper: {
        position: 'absolute',
        maxWidth: 800,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        // boxShadow: theme.shadows[5],
        // padding: theme.spacing(2, 4, 3),
        margin: 'auto'
    },
}));

export default function ProductCard({ productData }) {
    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const handleModal = () => {
        setOpen(prevState => !prevState);
    }

    return (
        <>
            <Card className={classes.card}>
                <CardActionArea onClick={handleModal}>
                    <CardMedia
                        component="img"
                        alt={productData.name}
                        //height="140"
                        image={productData.picture}
                        title={productData.name}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {productData.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {productData.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>

            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleModal}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                elevation={0}
            >
                <div className={classes.paper}>
                    <Card>
                        <CardActionArea onClick={handleModal}>
                            <CardMedia
                                component="img"
                                alt={productData.name}
                                image={productData.picture}
                                title={productData.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {productData.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {productData.description}
                                </Typography>
                                <Typography>
                                {Object.entries(productData.prices).map(([key, value]) => {
                                    return (
                                        <p>
                                            {key}, {value}
                                        </p>)
                                })}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>
            </Modal>

        </>
    );
}