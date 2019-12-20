import React, { useState, } from 'react';
import { Typography, Container, Button, Grid, TextField, FormControl, InputLabel, Select, CircularProgress } from '@material-ui/core';
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
  centerButton: {
    margin: 'auto',
  },
  spinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
}));

// Hold all sizes
const sizeButtons = ['One Size', 'Small', 'Medium', 'Large'];

export default function AddProductTab() {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();
  const [file, setFile] = useState(null);
  const [sizes, setSizes] = useState();
  const [buttons, setButtons] = useState([...sizeButtons]);

  // When uploaded file changes, update state
  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  // Remove Price inputs from list and ensure
  // the Size Button go back in order
  function removeSize(size) {
    const currBtns = [...sizeButtons];
    let a;
    switch (size) {
      case 'Small':
        setSizes([
          ...sizes
        ].filter(i => i !== 'Small'));
        a = currBtns.filter(el => {
          return buttons.includes(el) || el === 'Small';
        });
        setButtons([...a]);
        break;

      case 'Medium':
        setSizes([
          ...sizes
        ].filter(i => i !== 'Medium'));
        a = currBtns.filter(el => {
          return buttons.includes(el) || el === 'Medium';
        });
        setButtons([...a]);
        break;

      case 'Large':
        setSizes([
          ...sizes
        ].filter(i => i !== 'Large'));
        a = currBtns.filter(el => {
          return buttons.includes(el) || el === 'Large';
        });
        setButtons([...a]);
        break;

      case 'One Size':
        setSizes([
          ...sizes
        ].filter(i => i !== 'One Size'));
        setButtons([...sizeButtons]);
        break;

      default:
        break;
    }
  }

  // Add the sizes for displaying price inputs
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

  // Send the Add Product request back to the server
  async function sendAddProductRequest(e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Set loading state
    setLoading(true);

    // Form
    let form = e.target;

    // Ensure have a size
    if (!sizes) {
      setMessage('You must enter at least one price.');
      setLoading(false);
      return;
    }

    // Ensure a picture is uploaded
    if (!file) {
      setMessage('You must upload a picture.');
      setLoading(false);
      return;
    }

    // Get prices
    let prices = {};
    for (let element of sizes) {
      prices[element] = form[`${element}-price`].value;
    }

    // Config for Axios file upload
    const config = {
      onUploadProgress: function (progressEvent) {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        //console.log(percentCompleted)
      },
      headers: {
        'x-auth-token': JSON.parse(window.localStorage.getItem('user')).token
      }
    }

    // Form data to send to server for File Upload
    let data = new FormData();
    data.append('file', file);

    let resData = null;
    // Send request for file upload first
    // Don't allow updates to products database if file did not work
    try {
      const response = await axios.post('/api/upload', data, config);
      resData = response.data;
    } catch (err) {
      setMessage('Something went wrong trying to upload picture.');
      setLoading(false);
      setFile(null);
    }

    // file did not upload
    if (!resData) {
      setLoading(false);
      setFile(null);
      return;
    }

    let productInfo = {
      name: form.name.value,
      description: form.description.value,
      prices,
      picture: resData.path,
      category: form.category.value,
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
        // Successfully added product
        if (json.success) {
          setMessage('Sucessfully added product ' + json.doc.name);
          // Reset product form here
          form.reset();
          // Reset the sizes buttons
          setSizes();
          setButtons([...sizeButtons]);
          // Reset image upload
          setFile(null);

          // Send alert on success
          alert(`${json.doc.name} successfully added!`)
        } else {
          setMessage(`Could not add product: ${json.messages}`);

          // Send alert on error
          alert(`Could not add product: ${json.messages}`);
        }
      })
      .catch(err => {
        setMessage(`Could not add product: ${err}`);

        // Send alert on error
        alert(`Could not add product: ${err}`);
      })
      .finally(() => {
        setLoading(false);
        setFile(null);
      });
  }
  return (
    <>
      <Typography align="center" component="h1" variant="h5">
        Add product
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
                  <option value={'specialty'}>Specialty Beverages</option>
                  <option value={'food'}>Food</option>
                  <option value={'catering'}>Catering</option>

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
                  <Grid item xs={12} md={10}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id={`${value}-price`}
                      label={`${value} Price`}
                      name={`${value}-price`}
                      inputProps={{
                        type: 'number',
                        min: '0',
                        step: "0.01"
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2} className={classes.centerButton}>
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => removeSize(value)}
                    >
                      Remove {value}
                    </Button>
                  </Grid>
                </React.Fragment>
              );
            })}
            <Grid item xs={4}>
              <input
                id='picture-upload'
                accept="image/*"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <label htmlFor="picture-upload">
                <Button
                  component="span"
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Upload Picture
                </Button>
              </label>
            </Grid>
            <Grid item xs={8} style={{ margin: 'auto' }}>
              {file ?
                <Typography>
                  {file.name}
                </Typography>
                :
                ''
              }
            </Grid>
          </Grid>
          <div className={classes.wrapper}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Add Product
            </Button>
            {loading &&
              <CircularProgress size={16} className={classes.spinner} />
            }
          </div>
        </form>
        <Typography align="center" component="h1" variant="h5">
          {message}
        </Typography>
      </Container>
    </>
  );
}