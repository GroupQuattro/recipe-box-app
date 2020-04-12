import React, { useState, useEffect, Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, Switch, Platform, Dimensions, TouchableOpacity, Alert, TouchableHighlight } from "react-native";
import { FAB, Title, Headline, Subheading, Surface, Provider, Modal, Portal, Card, Button } from 'react-native-paper';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Firebase from '../configure/Firebase';
import axios from 'axios';
import { PulseIndicator } from 'react-native-indicators';
import * as Print from 'expo-print';
var sanitizeHtml = require('sanitize-html');
var stripHtml = require('string-strip-html');

function ViewBasicRecipe({ navigation, recipeDetail }) {
  let mainId = recipeDetail;
  console.log('recipdeDetailPassed');
  console.log(mainId);
  let htmlMain = ""
  let htmlTitle = "<h1>" + "</h1>";
  let htmlDescrition = "";
  let htmlIngredients = "";
  let htmlSteps = "";
  let htmlInfo = "";
  let htmlExtra = "";
  let htmlImage = "";
  // console.log('navigation in ViewBasicRecipe - start');
  console.log("html title ::")
  console.log(htmlTitle);
  const [responseStr, setResponseTxt] = useState("Oops! Something Went Wrong. Try Again Please.");
  const [iconName, setIconName] = useState('playlist-plus');
  const [ingred, setIngred] = useState([]); //setIngred is such a '=' sign to connect ingred and ingredientsArray to pass the ingredientsArray to ingred.
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState([]);
  let [noSteps, setNoSteps] = useState(false);
  let [isFound, setIsFound] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cookbookShowModal, setCookbookShowModal] = useState(false);
  const [readyInMinutes, setreadyInMinutes] = useState(0);
  const [servings, setservings] = useState(0);
  const [recipeInfo, setRecipeInfo] = useState();
  const [summary, setsummary] = useState(0);
  const [switchValue, setSwitchValue] = useState(false);
  // const [modalVisible, setModalVisible] = useState(false);
  var ingredientsArray = [];
  var stepArray = [];
  var mapArr = [];
  var noInstruction = true;
  // let noSteps = false;

  useEffect(() => {

    let apiKey = require('../configure/apiKey.json');
    let recipeId = { "id": "" + mainId };

    // axios.get('https://api.spoonacular.com/recipes/495111/information?apiKey=5c0548b90b2f4c1aa183c5b455dea8da')

    //axios.get('https://api.spoonacular.com/recipes/' + recipeId + '/analyzedInstructions?apiKey=' + apiKey.key) //Need to change the id and apiKey
    console.log('Calling API: ' + apiKey.baseURL + 'recipes/detail' + "With Obj: ", recipeId);
    axios.post(apiKey.baseURL + 'recipes/detail', recipeId, {  //3086,3094,3100
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      withCredentials: false,
    },
    ).then((res) => {

      if (res.data) {
        console.log('Recipe Detail');
        console.log(res.data);
        setIsFound(true);
        setRecipeInfo(res.data);
        console.log(recipeInfo);
        const readyInMin = res.data.readyInMinutes;
        setreadyInMinutes(readyInMin)
        const serves = res.data.servings
        setservings(serves);
        const recSummary = res.data.summary;

        var cleanSummary = sanitizeHtml(recSummary);
        let pureTextSummary = stripHtml(cleanSummary);
        htmlDescrition = htmlDescrition + "<div><p>" + pureTextSummary + "</p></div>"
        if (pureTextSummary.length > 0) {
          setsummary(pureTextSummary);
        }
        else {
          setsummary('N/A');
        }
        const ingredients = res.data.includedIngredients;

        console.log(ingredients);
        extractIngredients(ingredients)

        if (res.data.instructions.length != 0) {
          //  const info = res.data.analyzedInstructions[0].steps;
          //extractRecipeInformation(res.data.instructions);
          // console.log('HAS STUFF')
          console.log("Instrcuions");
          console.log(res.data.instructions);

          setStep(res.data.instructions);
          setLoading(false);
        }
        setLoading(false);
      }
      else {
        setLoading(false);
        setIsFound(false);
        setResponseTxt("Oops!, Something Went Wrong, Try Again Please.");
        setError("noUser", 'no user', "no account uses this email");
      }
    }).catch(error => {

      setIsFound(false);
      console.log("AXIOS CAUGHT ERROR ::::::::::::::::::::");
      setResponseTxt("Oops!, Something Went Wrong, Try Again Please.");
      setLoading(false);
      console.log(error);
    });
  }, []);

  const map = step.map((step, index) => {
    return (

      <Subheading key={index} style={{ color: '#000000', fontWeight: "400" }}>{"\n"}{index + 1}) {step.description} {"\n"}</Subheading >
    )
  })



  const toggleSwitch = (value) => {
    setSwitchValue(value);
  }

  const extractRecipeInformation = (info) => {

    htmlSteps = "<div><h2>Instructions: </h2><ul>"
    for (let i = 0; i < info.length; i++) {
      stepArray.push(info[i].step);
      htmlSteps = htmlSteps + "<li>" + info[i].step + "</li>";
      // console.log(info[i].step);
    }

    setStep(stepArray);
    htmlSteps = htmlSteps + "</ul></li ></div > "
    console.log("PDF HTML***");

    console.log(htmlTitle + htmlDescrition + htmlSteps);


  };

  const extractIngredients = (ingreds) => {

    for (let i = 0; i < ingreds.length; i++) {
      ingredientsArray.push(

        {
          id: ingreds[i].id,
          name: ingreds[i].name,
          amount: ingreds[i].amount,
          unit: ingreds[i].unit,
          count: 0

        }

      );
    }


    ingredientsArray = ingredientsArray.filter((ingredElement, index, self) =>
      index === self.findIndex((t) => (
        t.id === ingredElement.id
      ))
    )

    setIngred(ingredientsArray);

    setIngred(ingredientsArray);


    /*
    ingred - an array of steps. 
    each step is another object, object has an array of ingredients. 
    the ingredients array has many objects that has name as name of ingred. 
    */
  };

  const incrementCountHandler = (incomingIngred) => {

    let ingredsCopy = Array.from(ingred);

    ingredsCopy.forEach((curr) => {
      if (curr.id === incomingIngred.id) {
        if (curr.count >= 0) {
          curr.count = curr.count + 1;
        }
      }
    })

    setIngred(ingredsCopy);
  };


  const decrementCountHandler = (incomingIngred) => {

    let ingredsCopy = Array.from(ingred);

    ingredsCopy.forEach((curr) => {
      if (curr.id === incomingIngred.id) {
        if (curr.count > 0) {
          curr.count = curr.count - 1;
        }
      }

    })
    setIngred(ingredsCopy);
  };

  const makeJsontoObject = (JsonObject) => {
    if (JsonObject.length != 0) {
      for (let i = 0; i < JsonObject.length; i++) {
        JsonObject[i] = JSON.stringify(JsonObject[i]);
      }
    } else {
      console.log('Hey you should pick at least one of the ingredients.');
    }

    return JsonObject;


  }
  const downloadRecipe = async () => {
    let htmlTitle = "<div><h2>" + recipeInfo.title + " </h2></div>";
    let htmlStepsTitle = "<div><h2>Steps</h2><ul>"
    if (step.length > 0) {
      step.forEach(i => {
        htmlSteps = htmlSteps + "<li>" + i.description + "</li>"
      })
    }
    else {
      htmlSteps = "<li>" + "Not Available" + "</li>"
    }
    htmlSteps = htmlSteps + "</ul></div>"

    let htmlIngredientsTitle = "<div><h2>Ingredients</h2><ul>"
    if (ingred.length > 0) {
      console.log(ingred[0]);
      ingred.forEach(i => {
        htmlIngredients = htmlIngredients + "<li>" + i.name + ' ' + i.amount + " " + i.unit + "" + "</li>"
      })
    }
    else {
      htmlIngredients = "<li>" + "Not Available" + "</li>"
    }
    htmlIngredients = htmlIngredients + "</ul></div>"
    htmlDescrition = "<p>" + summary + "</p>"

    let finalPdfHtml = "<div style='margin:20px'>" + htmlTitle + htmlDescrition + htmlIngredientsTitle + htmlIngredients + htmlStepsTitle + htmlSteps + "</div>";

    const options = { html: finalPdfHtml, base64: false };

    // Put this in an onPress for a button or in a function you want to print from

    Print.printAsync(options).catch((err) => {
      console.log(err);
    });

  };
  const addToList = () => {
    if (iconName == 'bookmark-plus')
      setIconName('bookmark-check');
    else
      setIconName('bookmark-plus');

    setShowModal(true);

  }


  if (loading) {
    return (
      <SafeAreaView style={{ flex: 3 }}>


        <PulseIndicator style={{ position: "relative" }} animating={true} size={180} color='#69F0AE' />

      </SafeAreaView>
    )
  } else if (!loading) {

    const saveRecipe = () => {

      // CHECK IF USER IS LOGGED IN. IF SO SEND TO API AND ADD TO CURRENT USER'S LIST OF SAVED RECIPES

      setShowModal(true);
      console.log('showModal', showModal);
    }

    const addRecipeToCookbook = (id) => {


      /*
      ****************************************************************************************************************
      **********************************************Database part*****************************************************
      ****************************************************************************************************************
      */

      //    var auth = Firebase.auth();
      //    const user_id = auth.currentUser.uid;

      // const recipeInfo = {
      //     "uid": id,
      //     "userId": user_id,
      //     "cookbookId": ,
      // }

      // Axios.post(baseURL + 'userAccount/getUserAccount', recipeInfo, {
      //     headers: {
      //       'content-type': 'application/json',
      //       'Access-Control-Allow-Origin': '*',

      //     }
      //   }).then((response) => {
      //     // if(response.data.uid ||;
      //     console.log(response);
      //     if (response.data) {
      //       setSecurityQuestion(response.data.securityQuestion)
      //       setResponse(response.data.response);
      //       setUserFound(true);
      //     }
      //     else {
      //       setError("noUser", 'no user', "no account uses this email");
      //     }
      //   }).catch(error => {
      //     // setLoading(false);
      //     console.log("Error" + error);
      //   });
    }


    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {
            /*
        <View style={styles.titleBar}>
            <Ionicons name="ios-arrow-back" size={24} color="rgb(82,87,93)"></Ionicons>
            <Ionicons name="md-more" size={24} color="rgb(82,87,93)"></Ionicons>
        </View>
        */
          }
          <View style={{ alignSelf: "center" }}>
            <View style={styles.profileImage}>

              <Image source={{ uri: (recipeInfo.image) ? recipeInfo.image : "https://zabas.com/wp-content/uploads/2014/09/Placeholder-food.jpg" }} style={styles.image} resizeMode="center"></Image>
            </View>



          </View>


          <View style={styles.infoContainer}>
            <Headline style={{ color: '#000000', fontWeight: "600" }}>{recipeInfo.title}</Headline>
            < Button color={'#FFFFFF'} style={{ margin: 10, backgroundColor: "#FF80AB" }} onPress={downloadRecipe}>Print Recipe</Button>
          </View>

          {/* <View style={styles.ratingContainer}>
                    <Rating rating={0} numStars={5} starColor="orange" />
                </View> */}

          <View style={styles.statsContainer}>
            <View style={styles.statsBox}>
              <Text style={[styles.text, { fontSize: 18 }]}>{readyInMinutes}</Text>
              <Text style={[styles.text, styles.subText]}>Ready In Minutes</Text>
            </View>
            <Text style={{ fontSize: 34, color: '#99ccff' }}> | </Text>
            <View style={styles.statsBox}>
              <Text style={[styles.text, { fontSize: 20 }]}>{servings}</Text>
              <Text style={[styles.text, styles.subText]}>Servings</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statsBox}>
              <Text style={[styles.text, { fontSize: 18 }]}>{(recipeInfo.cuisine) ? recipeInfo.cuisine : 'N/A'}</Text>
              <Text style={[styles.text, styles.subText]}>Cuisine</Text>
            </View>
            <Text style={{ fontSize: 34, color: '#99ccff' }}> | </Text>
            <View style={styles.statsBox}>
              <Text style={[styles.text, { fontSize: 20 }]}>{(recipeInfo.mealType) ? recipeInfo.mealType : 'N/A'}</Text>
              <Text style={[styles.text, styles.subText]}>Meal Type</Text>
            </View>
          </View>
          <View style={{ marginTop: 32 }}>
            <Subheading style={{ textAlign: "center", fontSize: 18, fontWeight: "600" }}>Description</Subheading>
            <ScrollView style={{ maxHeight: (summary.length < 100) ? 90 : 150, backgroundColor: "#EF9A9A", borderRadius: 10, padding: 10, minWidth: '100%' }}>

              <Subheading style={{ textAlign: "center", marginBottom: 15 }}>{summary}</Subheading>
            </ScrollView>

          </View>

          {recipeInfo.includedIngredients.length > 0 ?
            <View style={styles.viewBoxStyle}>
              {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}> */}
              <Headline style={{ color: '#FFFFFF', fontWeight: "600" }}>Ingredients</Headline>
              {ingred.map((oneIngred, index) => {
                return (
                  <Card key={index + 1} style={styles.nestedCardStyle}>
                    <View style={{ flexDirection: 'row' }}>

                      <Text style={{ margin: 6, color: '#000000', fontSize: 16 }}>{oneIngred.name} ( {oneIngred.amount} {oneIngred.unit} )</Text>
                      {/* <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: "center", alignContent: "center" }}>
                                            <TouchableOpacity style={styles.button} onPress={() => {
                                                decrementCountHandler(oneIngred);
                                            }}><Text>-</Text></TouchableOpacity>
                                            <Text>{oneIngred.count}</Text>
                                            <TouchableOpacity style={styles.button} onPress={() => {
                                                incrementCountHandler(oneIngred)
                                            }}><Text>+</Text></TouchableOpacity>
                                        </View> */}
                    </View>
                  </Card>

                )
              })}


            </View>
            :
            <View style={{ flex: 1 }}>
              <Title style={{ textAlign: "center" }}>No Ingredients Added Yet</Title>
            </View>
          }

          {recipeInfo.instructions.length > 0 ?
            <View style={styles.viewBoxStyle}>
              {/* <View style={styles.viewBoxStyle}> */}
              <Headline style={{ color: '#FFFFFF', fontWeight: "600", alignItems: 'center' }}>Instructions</Headline>

              <View style={{ margin: 10 }}>
                <Text> {map} </Text>

              </View>
            </View>

            :
            <View style={{ flex: 1, margin: 10 }}>
              <Title style={{ textAlign: "center" }}>No Steps Added Yet</Title>
            </View>
          }


        </ScrollView>
      </SafeAreaView>
    );


  }
  else if (!isFound) {
    return (
      <SafeAreaView>
        <Title>{responseStr}</Title>
      </SafeAreaView>

    );
  }
}

export default ViewBasicRecipe;

const styles = StyleSheet.create({
  modalText: {
    marginBottom: 15,
    textAlign: "left"
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalStyle: {
    flex: 3,
    justifyContent: 'center',
    paddingTop: 3,
    padding: 8,
    backgroundColor: '#FFFFFF',

    ...Platform.select({
      ios: {
        width: (Dimensions.get('screen').width - 15),
        height: (Dimensions.get('screen').height - 50)
      },
      web: {
        //  width: (Dimensions.get('window').width - 50),
        //  height: (Dimensions.get('window').height - 50)
      },
      android: {
        // width: (Dimensions.get('screen').width - 50),
        // height: (Dimensions.get('screen').height - 50)
      },
    })
  },
  button: {
    alignItems: "center",
    backgroundColor: "#d2f2fc",
    padding: 10,
    borderRadius: 10,
  },
  instructionStyle: {
    padding: 0,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    margin: 5,
    height: 'auto',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        width: "auto"
      },
      android: {
        width: "auto"
      },
      web: {
        width: ((Dimensions.get('window').width) < 500) ? ((Dimensions.get('window').width) - 70) : 550,


      }

    }),
  },
  switchStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  nestedCardStyle: {
    padding: 0,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    margin: 5,
    height: 'auto',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        width: "auto"
      },
      android: {
        width: "auto"
      },
      web: {
        width: ((Dimensions.get('window').width) < 500) ? ((Dimensions.get('window').width) - 70) : 550,


      }

    }),
  },
  viewBoxStyle: {
    marginTop: 10,
    backgroundColor: '#99ccff',
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 0,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    height: 'auto',
    ...Platform.select({
      ios: {
        width: "auto"
      },
      android: {
        width: "auto"
      },
      web: {
        width: ((Dimensions.get('window').width) < 500) ? ((Dimensions.get('window').width) - 50) : 600,


      }
    })
  },
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  text: {

    color: "rgb(82, 87, 93)",
    textAlign: "center"
  },
  subText: {
    fontSize: 12,
    color: "#rgb(174, 181, 188)",
    textTransform: "uppercase",
    fontWeight: "500"

  },
  image: {
    flex: 1,
    width: "auto",
    height: "auto"
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginHorizontal: 16
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden"
  },
  dm: {
    backgroundColor: "rgb(65,68,75)",
    position: "absolute",
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  active: {
    backgroundColor: "#34FF89",
    position: "absolute",
    bottom: 20,
    left: 10,
    padding: 4,
    height: 20,
    width: 20,
    borderRadius: 10

  },
  add: {
    // backgroundColor: "#41444B",
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"

  },
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 16
  },
  statsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 32

  },
  statsBox: {
    alignItems: "center",
    flex: 1

  },
  mediaImageContainer: {
    width: 180,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 10
  },
  mediaCount: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: "50%",
    marginTop: -50,
    marginLeft: 30,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    shadowColor: "rgba(0, 0 ,0 ,0.38)",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    shadowOpacity: 1

  },
  recent: {
    marginLeft: 78,
    marginTop: 32,
    marginBottom: 6,
    fontSize: 10
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16
  },
  recentItemIndicator: {
    backgroundColor: "#CABFAB",
    padding: 4,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: 12,
    marginRight: 3

  },
  buttonHover: {
    color: "#CABFAB"
  }

});