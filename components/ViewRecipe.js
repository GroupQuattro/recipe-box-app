import React, { useState, useEffect, Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, Button, Switch, Platform, Dimensions, TouchableOpacity } from "react-native";
import { FAB, Title, Headline, Subheading, Surface, Card } from 'react-native-paper';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';


function ViewRecipe({ navigation, recipeDetail }) {
  recipeDetail = JSON.parse(recipeDetail.props);
  let htmlMain = ""
  let htmlTitle = "<h1>" + recipeDetail.title + "</h1>";
  let htmlDescrition = "";
  let htmlIngredients = "";
  let htmlSteps = "";
  let htmlInfo = "";
  let htmlExtra = "";
  let htmlImage = "";
  // console.log('navigation in ViewRecipe - start');
  console.log("html title ::")
  console.log(htmlTitle);
  // console.log('navigation in ViewRecipe - end')

  console.log('Showing the id of the recipe - start');
  console.log(recipeDetail)
  console.log('Showing the id of the recipe - end')

  //const baseUri = `https://spoonacular.com/recipeImages/`;
  const [iconName, setIconName] = useState('playlist-plus');
  const [ingred, setIngred] = useState([]); //setIngred is such a '=' sign to connect ingred and ingredientsArray to pass the ingredientsArray to ingred.
  const [step, setStep] = useState([]);
  let [noSteps, setNoSteps] = useState(false);
  const [readyInMinutes, setreadyInMinutes] = useState(0);
  const [servings, setservings] = useState(0);
  const [summary, setsummary] = useState(0);
  const [switchValue, setSwitchValue] = useState(false);
  var ingredientsArray = [];
  var stepArray = [];
  var noInstruction = true;
  // let noSteps = false;

  useEffect(() => {
    console.log('useEffect has been called');
    let ingredients = "apples,+flour,+sugar"
    let apiKey = require('../configure/apiKey.json');
    let recipeId = recipeDetail.id;
    if (ingredients) {
      console.log('If statement is called');
      console.log('https://api.spoonacular.com/recipes/' + recipeId + '/information?apiKey=' + apiKey.key);
      //axios.get('https://api.spoonacular.com/recipes/' + recipeId + '/analyzedInstructions?apiKey=' + apiKey.key) //Need to change the id and apiKey
      axios.get('https://api.spoonacular.com/recipes/' + recipeId + '/information?apiKey=' + apiKey.key)
        .then(res => {
          console.log('Receipe API is called');
          console.log(recipeId);
          const readyInMin = res.data.readyInMinutes;
          setreadyInMinutes(readyInMin)
          const serves = res.data.servings
          setservings(serves);
          const recSummary = res.data.summary;
          var dirty = 'some really tacky HTML';
          var cleanSummary = sanitizeHtml(recSummary);
          let pureTextSummary = stripHtml(cleanSummary);
          htmlDescrition = htmlDescrition + "<div><p>" + pureTextSummary + "</p></div>"
          setsummary(pureTextSummary);
          const ingredients = res.data.extendedIngredients;
          console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
          console.log(ingredients);
          extractIngredients(ingredients)

          if (res.data.analyzedInstructions.length != 0) {
            const info = res.data.analyzedInstructions[0].steps;
            extractRecipeInformation(info);
            // console.log('HAS STUFF')
          } else {
            setNoSteps(() => {
              noSteps = true;
            });
            console.log(noSteps);
            console.log('Hi bro');
          }

          // console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
          // console.log(res.data.preparationMinutes);



          const map = step.map((step, index) => {
            return (
              // <View key={index} style={styles.instructionStyle}>
              <Text key={index} style={{ color: '#000000', fontWeight: "400" }}>{index + 1}. {step}</Text>
              // </View>
            )
          })





          const toggleSwitch = (value) => {
            setSwitchValue(value);
          }



          for (let i = 0; i < info.length; i++) {
            stepArray.push(info[i].step);
          }

          setStep(stepArray);

        }, []);

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
        htmlSteps = htmlSteps + "</ul></li></div>"
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
        // console.log(`YOOOOOO`)
        // console.log(ingredientsArray)

        // for (let i = 0; i < ingreds.length; i++) {
        //     for (let j = 0; j < ingreds[i].ingredients.length; j++) {
        //         ingreds[i].ingredients[j].count = 0;
        //         ingredientsArray.push(ingreds[i].ingredients[j]); //IngredientsArray currently holds a collection of ingredients' objects
        //     }
        // }

        ingredientsArray = ingredientsArray.filter((ingredElement, index, self) =>
          index === self.findIndex((t) => (
            t.id === ingredElement.id
          ))
        )

        //ingredElement is each element of ingredientsArray, index is 0,1,2..., self is ingredientsArray, t is basically same as the ingredElement
        // if the index is not matching returned number made by self.findIndex, it would not return. 

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

        return JsonObject;
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

        console.log('Jason Object Array');
        // console.log(JasonObject);
        return JsonObject;


      }

      <View style={styles.infoContainer}>
        <Headline style={{ color: '#000000', fontWeight: "600" }}>{recipeDetail.title}</Headline>
        <Text style={[styles.text, { color: "#AEB5BC", fontSize: 14 }]}>World Best!</Text>
      </View>

      {/* <View style={styles.ratingContainer}>
                    <Rating rating={0} numStars={5} starColor="orange" />
                </View> */}

      <View style={styles.statsContainer}>
        <View style={styles.statsBox}>
          <Text style={[styles.text, { fontSize: 24 }]}>{prepareMinute} Min</Text>
          <Text style={[styles.text, styles.subText]}>Prepare Minute</Text>
        </View>
        <View style={[styles.statsBox, { borderColor: "#DFDBCB", borderLeftWidth: 1, borderRightWidth: 1 }]}>
          <Text style={[styles.text, { fontSize: 24 }]}>{cookingMinute} Min</Text>
          <Text style={[styles.text, styles.subText]}>Cooking Minute</Text>
        </View>
        <View style={styles.statsBox}>
          <Text style={[styles.text, { fontSize: 24 }]}>{healthScore} Point</Text>
          <Text style={[styles.text, styles.subText]}>Health Score</Text>
        </View>
      </View>
      const addToList = () => {
        if (iconName == 'bookmark-plus')
          setIconName('bookmark-check');
        else
          setIconName('bookmark-plus');

      }

      const saveRecipe = () => {

        // CHECK IF USER IS LOGGED IN. IF SO SEND TO API AND ADD TO CURRENT USER'S LIST OF SAVED RECIPES

      }

      const downloadRecipe = () => {

        // SOMEHOW MAKE INTO A PDF AND SAVE

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
                <Image source={{ uri: recipeDetail.image }} style={styles.image} resizeMode="center"></Image>
              </View>
              <View style={styles.dm}>
                {
                  //<MaterialIcons name="chat" size={18} color="#DFD8C8"></MaterialIcons>
                }
              </View>
              <View style={styles.active}></View>
              <View style={styles.add}>
                <FAB icon={iconName} small={false} size={48} color="#DFD8C8" onPress={addToList} style={{ marginTop: 6, marginLeft: 2 }}> </FAB>
                {/* <Ionicons name="ios-add" size={48} color="#DFD8C8" style={{ marginTop: 6, marginLeft: 2 }}></Ionicons> */}
              </View>
            </View>


            <View style={styles.infoContainer}>
              <Headline style={{ color: '#000000', fontWeight: "600" }}>{recipeDetail.title}</Headline>
            </View>



            <View style={styles.statsContainer}>
              <View style={styles.statsBox}>
                <Text style={[styles.text, { fontSize: 18 }]}>{readyInMinutes}</Text>
                <Text style={[styles.text, styles.subText]}>Ready In Minutes</Text>
              </View>
              <Text style={{ fontSize: 34, color: '#99ccff' }}> | </Text>
              <View style={styles.statsBox}>
                <Text style={[styles.text, { fontSize: 24 }]}>{servings}</Text>
                <Text style={[styles.text, styles.subText]}>Servings</Text>
              </View>
            </View>

            <View style={{ marginTop: 32 }}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {/* 
                        <View style={styles.mediaImageContainer}>
                            <Image source={{ uri: recipeDetail.image }} style={styles.image} resizeMode="cover"></Image>
                        </View>
                        <View style={styles.mediaImageContainer}>
                            <Image source={require("../assets/images/background.jpg")} style={styles.image} resizeMode="cover"></Image>
                        </View>
                        <View style={styles.mediaImageContainer}>
                            <Image source={require("../assets/images/background.jpg")} style={styles.image} resizeMode="cover"></Image>
                        </View>
                        <View style={styles.mediaImageContainer}>
                            <Image source={require("../assets/images/background.jpg")} style={styles.image} resizeMode="cover"></Image>
                        </View> */}

              </ScrollView>
              {/* <View style={styles.mediaCount}>
                        <Text style={[styles.text, { fontSize: 24, color: "#DFD8C8", fontWeight: "300" }]}>70</Text>
                        <Text style={[styles.text, { fontSize: 12, color: "#DFD8C8", textTransform: "uppercase" }]}>Media</Text>
                    </View> */}
            </View>

            <View style={styles.viewBoxStyle}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                <Headline style={{ color: '#FFFFFF', fontWeight: "600" }}>Ingredients</Headline>
                {console.log(ingred, 'removed dupes')}
                {ingred.map((oneIngred, index) => {
                  return (
                    <Card key={index + 1} style={styles.nestedCardStyle}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={styles.recentItemIndicator}></View>
                        <Text style={{ color: '#000000', fontWeight: "400" }}>{oneIngred.name} ( {oneIngred.amount} {oneIngred.unit} )</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                          <Button title='-' onPress={() => {
                            decrementCountHandler(oneIngred);
                          }}></Button>
                          <Text>{oneIngred.count}</Text>
                          <Button style={styles.buttonHover} title='+' onPress={() => {
                            incrementCountHandler(oneIngred)
                          }}></Button>
                        </View>
                      </View>
                    </Card>

                  )
                })}
                <View style={{ backgroundColor: "#CC5090", borderRadius: 5 }}>
                  <Button color="#FFFFFF" title="View Shopping List" onPress={() => {
                    navigation.navigate('Shopping', makeJsontoObject(ingred));
                    // navigation.navigate('Shopping', ingred);
                    // navigation.navigate('Test', makeJsontoObject(ingred));
                    console.log('Button is clicked');
                    console.log(ingred);
                    console.log('Bye Button');
                  }}></Button>
                </View>

                <View style={styles.viewBoxStyle}>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.button} onPress={() => { saveRecipe() }}>
                      <Text>Save Recipe</Text>
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 10 }}> </Text>
                    <TouchableOpacity style={styles.button} onPress={() => { downloadRecipe() }}>
                      <Text>Download Recipe</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.viewBoxStyle}>
                </View >
                <Text style={[styles.text, { color: "#FFFFFF", margin: 8, fontWeight: "500", fontSize: 18 }]}>
                  {summary}
                </Text>
              </View>

              <View >

                <View style={{ width: 300, alignContent: "center", alignSelf: "center" }}>


                </View>
              </View>


              <View style={styles.viewBoxStyle}>
                {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}> */}
                <Headline style={{ color: '#FFFFFF', fontWeight: "600" }}>Ingredients</Headline>
                {ingred.map((oneIngred, index) => {
                  return (
                    <Card key={index + 1} style={styles.nestedCardStyle}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={styles.recentItemIndicator}></View>
                        <Text style={{ marginTop: 6, color: '#000000', fontSize: 16 }}>{oneIngred.name} ( {oneIngred.amount} {oneIngred.unit} )</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                          <TouchableOpacity style={styles.button} onPress={() => {
                            decrementCountHandler(oneIngred);
                          }}><Text>-</Text></TouchableOpacity>
                          <Text>{oneIngred.count}</Text>
                          <TouchableOpacity style={styles.button} onPress={() => {
                            incrementCountHandler(oneIngred)
                          }}><Text>+</Text></TouchableOpacity>
                        </View>
                      </View>
                    </Card>

                  )
                })}

                <TouchableOpacity style={styles.button}
                  // color='#FFFFFF' style={{ backgroundColor: '#388E3C', marginTop: 20 }}
                  onPress={() => {
                    navigation.navigate('Shopping', makeJsontoObject(ingred));
                  }}><Text>View Shopping List</Text></TouchableOpacity>

                {/* </View > */}
              </View>



              <View style={styles.viewBoxStyle}>
                {/* <View style={styles.viewBoxStyle}> */}
                <Headline style={{ color: '#FFFFFF', fontWeight: "600", alignItems: 'center' }}>View Instruction</Headline>

                <Text> {map} </Text>

              </View>



            </View>

          </ScrollView>
        </SafeAreaView>

      );

    }

    export default ViewRecipe;

    const styles = StyleSheet.create({
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
        flex: 1,
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
        flex: 1,
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
        width: 100,
        height: 100
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
        flex: 1,
        marginRight: 4

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
        marginTop: 3,
        marginRight: 20

      },
      buttonHover: {
        color: "#CABFAB"
      },

    });