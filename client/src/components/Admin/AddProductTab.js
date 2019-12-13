import React, { useState, } from 'react';
import { Typography, Container, Button, Grid, TextField, FormControl, InputLabel, Select } from '@material-ui/core';
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
  },
}));

export default function AddProductTab() {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState();
  const [message, setMessage] = useState();
  const [file, setFile] = useState();
  const [sizes, setSizes] = useState();
  const [buttons, setButtons] = useState(['One Size', 'Small', 'Medium', 'Large']);

  function handleFileChange(e) {
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
        setButtons([]);
        setSizes(['One Size']);
        break;
      default:
        break;
    }
  }

  async function sendAddProductRequest(e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Set loading state
    setLoading(true);

    let form = e.target;

    let prices = {};
    for (let element of sizes) {
      prices[element] = form[`${element}-price`].value
    }

    //console.log(prices)

    const config = {
      onUploadProgress: function (progressEvent) {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        //console.log(percentCompleted)
      },
      headers: {
        'x-auth-token': JSON.parse(window.localStorage.getItem('user')).token
      }
    }

    let data = new FormData();
    data.append('file', file[0]);


    let resData = null;
    try {
      const response = await axios.post('/api/upload', data, config);
      resData = response.data;
    } catch (err) {
      console.log(err);
      setLoading(false);
      setFile(null);
    }

    // file did not upload
    if (!resData) {
      console.log('did not upload file');
      return;
    }

    let productInfo = {
      name: form.name.value,
      description: form.description.value,
      prices,
      picture: resData.path
    };

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
          setMessage('Sucessfully added product ' + json.doc.name);
        } else {
          setMessage(`Could not add product: ${json.messages}`);
        }
      })
      .catch(err => {
        setMessage(`Could not add product: ${err}`);
      })
      .finally(() => {
        setLoading(false);
        setFile(null);
      });
  }
  return (
    <>
      <Typography align="center" component="h1" variant="h5">
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
            {buttons && buttons.map((value, idx) => {
              return (
                <Grid item xs={12} sm={12 / buttons.length} key={idx}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.sizeButton}
                    onClick={() => handleSizes(value)}
                  >
                    Add {value}
                  </Button>
                </Grid>
              );
            })}
            {sizes && sizes.map((value, idx) => {
              return (
                <React.Fragment key={value}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id={`${value}-price`}
                      label={`${value} Price`}
                      name={`${value}-price`}
                      inputProps={{
                        type: 'number',
                        min: '0'
                      }}
                    />
                  </Grid>
                </React.Fragment>
              );
            })}
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