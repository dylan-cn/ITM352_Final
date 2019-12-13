import React, { useState, useEffect } from 'react';
import { Typography, Container, Button, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Grid, TextField, FormControl, InputLabel, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    users: {
        marginTop: theme.spacing(4),
    },
    wrapper: {
        marginTop: theme.spacing(4)
    }
}));

export default function AddProductTab() {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState();
    const [message, setMessage] = useState();
    const [file, setFile] = useState();
    const [fileUploaded, setFileUploaded] = useState(false);
    const [fileName, setFileName] = useState();
    const [sizes, setSizes] = useState();
    const [buttons, setButtons] = useState(['One Size', 'Small', 'Medium', 'Large']);  

    function handleFileChange(e){
        // console.log(e.target.files)
        setFile(e.target.files)
    }
    function handleSizes(size) {
        switch (size) {
          case 'Small':
            if (sizes) {
              setSizes([
                ...sizes,
                'Small'
              ]);
            } else {
              setSizes([
                'Small'
              ]);
            }
            setButtons([...buttons].filter(i => i !== 'Small'));
            break;
          case 'Large':
            if (sizes) {
              setSizes([
                ...sizes,
                'Large'
              ]);
            } else {
              setSizes([
                'Large'
              ]);
            }
            setButtons([...buttons].filter(i => i !== 'Large'));
            break;
          case 'Medium':
            if (sizes) {
              setSizes([
                ...sizes,
                'Medium'
              ]);
            } else {
              setSizes([
                'Medium'
              ]);
            }
            setButtons([...buttons].filter(i => i !== 'Medium'));
            break;
          case 'One Size':
            if (sizes) {
              setSizes([
                ...sizes,
                'One Size'
              ]);
            } else {
              setSizes([
                'One Size'
              ]);
            }
            setButtons([...buttons].filter(i => i !== 'One Size'));
            break;
          default:
            break;
        }
      }
    // from github gist
    async function upload(files) {
        const config = {
          onUploadProgress: function(progressEvent) {
            var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            //console.log(percentCompleted)
          },
          headers: {
            'x-auth-token': JSON.parse(window.localStorage.getItem('user')).token
          }
        }
      
        let data = new FormData();
        data.append('file', files[0]);
        
        axios.post('/api/upload', data, config)
          .then(res => {
              console.log(res);
              setFileUploaded(true);
              setFileName(res.data.path);
          })
          .catch(err => {
              console.log(err)
              setFileUploaded(false);
            });
      }

    async function sendAddProductRequest(e) {
        // Prevent the form from submitting
        e.preventDefault();

        // Set loading state
        setLoading(true);

        let form = e.target;

        let prices = {};
        for(let element of sizes) {
            prices[element]=form[`${element}-price`].value
        }

        //console.log(prices)

        let productInfo = {
            name: form.name.value,
            description: form.description.value,
            prices
        };

        await upload(file);

        // file did not upload
        if (!fileUploaded) {
            return;
        }

        productInfo.picture = fileName;

        // Send request to register
        fetch('/api/product/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': JSON.parse(window.localStorage.getItem('user')).token
            },
            body: JSON.stringify(productInfo)
        })
            .then(res => res.json())
            .then(json => {
                // successfully added product
                if (json.success) {
                    // Create product

                    // Save user into local storage upon account creation
                    // Stringify the object
                    // window.localStorage.setItem('product', JSON.stringify(user));
                    setMessage('sucessfully added product ' + json.doc.name);
                } else {
                    setMessage(json.messages);
                }
            })
            .catch(err => {

            })
            .finally(() => {
                setLoading(false);
                setFile(null);
                setFileUploaded(null);
                setFileName(null);

            });
    }
    return (
        <>
            <Typography component="h1" variant="h5">
                This is the add product tab
            </Typography>

            <Container className={classes.users}>
                <form className={classes.form} onSubmit={sendAddProductRequest}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                autoFocus
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                variant="outlined"
                                required
                                fullWidth
                                id="description"
                                label="Description"
                                multiline
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant="filled" className={classes.formControl} fullWidth>
                                <InputLabel htmlFor="filled-age-native-simple">Category</InputLabel>
                                <Select
                                    native
                                    // value={state.age}
                                    // onChange={handleChange('age')}
                                    inputProps={{
                                        name: 'category',
                                        id: 'category-select',
                                    }}
                                >
                                    <option value={'coffee'}>Coffee</option>
                                    <option value={'tea'}>Tea</option>
                                    <option value={'breakfast'}>Breakfast</option>
                                    <option value={'lunch'}>Lunch</option>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <input
                                id='picture-upload'
                                accept="image/*"
                                type="file"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />

                            <label htmlFor="picture-upload">
                                <Button component="span">
                                    Upload Picture
                                </Button>
                            </label>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
              {buttons && buttons.map((value, idx) => {
                return (
                  <Grid item xs={12 / buttons.length} key={idx}>
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={() => handleSizes(value)}
                    >
                      Add {value}
                    </Button>
                  </Grid>
                );
              })}
              {sizes && sizes.map((value, idx) => {
                return (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        disabled
                        fullWidth
                        id="size"
                        label="Product Size"
                        name="size"
                        value={value}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id={`${value}-price`}
                        label="Price"
                        name={`${value}-price`}
                      />
                    </Grid>
                  </>
                );
              })}
            </Grid>
                    <div className={classes.wrapper}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Add Product
                            </Button>
                    </div>
                </form>
                <Typography>
                    {message}
                </Typography>
            </Container>
        </>
    );
}