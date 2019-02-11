/**
 * Braille Embosser
 *
 * @category Education
 * @author Keziah MOSELLE <keziahmoselle@protonmail.com>
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 * @link https://github.com/dream-io/braille-embosser
 */

import React from 'react';
import {View,StyleSheet} from 'react-native';
import {
  StyleProvider,
  Root,
  Container,
  Header,
  Title,
  Left,
  Button,
  Icon,
  Right,
  Body,
  Content,
  Text,
  Card,
  CardItem,
  Form,
  Item,
  Label,
  Input,
  Footer,
  FooterTab,
  Toast,
  Fab
} from 'native-base';
// Récupère le thème de couleur de Native Base
import getTheme from './native-base-theme/components';
import commonColor from  './native-base-theme/variables/commonColor';
import SocketIOClient from 'socket.io-client';

export default class App extends React.Component {

  constructor(props)
  {
    super(props);

    // State
    this.state = {
      text: undefined,
      status: '',
      showToast: false,
      connected: false,
      ipAddress: 'http://192.168.43.73:8080',
    };

    this.socket = SocketIOClient(this.state.ipAddress);

    this.socket.on('connect', () =>
    {
      this.setState({ connected: true });
      Toast.show({
        text: 'Connecté au Raspberry Pi.',
        position: 'top',
        buttonText: 'Ok'
      });
    });

    this.socket.on('S0', (data) =>
    {
      Toast.show({
        text: 'Caractère embossé.',
        position: 'top',
        buttonText: 'Ok'
      });
      console.log(data);
    });

    this.socket.on('S1', (data) =>
    {
      Toast.show({
        text: 'La phrase a été embossée.',
        position: 'top',
        buttonText: 'Ok'
      });
      console.log(data);
    });


  }
  
  // Fonction qui enverra le texte à imprimer au serveur
  print = () =>
  {
    if(this.state.text === undefined)
    {
      Toast.show({
        text: 'Le champs est vide !',
        position: 'top',
        buttonText: 'Ok'
      });
    }
    else
    {
      if (this.state.connected)
      {
        this.socket.emit('print', this.state.text);
        Toast.show({
          text: 'Impression en cours...',
          position: 'top',
          buttonText: 'Ok'
        });
      }
      else
      {
        Toast.show({
          text: 'Vous n\'êtes pas connecté au Raspberry Pi.',
          position: 'top',
          buttonText: 'Ok'
        });
      }
    }
  }

  voiceRecognition = () => 
  {
    Toast.show({
      text: 'En développement...',
      position: 'top',
      buttonText: 'Ok'
    });
  }

  paperForward = () =>
  {
    if (this.state.connected)
    {
      this.socket.emit('paperForward', 'PAPERF');
      Toast.show({
        text: 'Demande envoyé.',
        position: 'top',
        buttonText: 'Ok'
      });
    }
    else
    {
      Toast.show({
        text: 'Vous n\'êtes pas connecté au Raspberry Pi',
        position: 'top',
        buttonText: 'Ok'
      });
    }
  }

  changeIpAddress = () =>
  {
    if (this.state.ipAddress === 'http://192.168.43.73:8080')
    {
      this.setState({ ipAddress: 'http://86.243.47.183:8080', connected: false });
      Toast.show({
        text: this.state.ipAddress,
        position: 'bottom',
        buttonText: 'Ok'
      });
    }
    else if (this.state.ipAddress === 'http://86.243.47.183:8080')
    {
      this.setState({ ipAddress: 'http://192.168.43.73:8080', connected: false });
      Toast.show({
        text: this.state.ipAddress,
        position: 'bottom',
        buttonText: 'Ok'
      });
    }
  }

  promptIpAddress = () =>
  {
    this.setState({ prompt: true });
  }

  reconnect = () =>
  {
    console.log(this.socket);

    Toast.show({
      text: this.state.ipAddress,
      position: 'bottom',
      buttonText: 'Ok'
    });

    if (this.state.prompt)
    {
      this.setState({ prompt: false });
    }
  }

  render() {
    return (
      <StyleProvider style={getTheme(commonColor)}>
        <Root>
          <Container>

            <Header>
              <Left style={styles.padding}>
                <Button transparent onPress={this.changeIpAddress} onLongPress={this.promptIpAddress}>
                  <Icon name='print'></Icon>
                </Button>
              </Left>

              <Right>
                <Button transparent onPress={this.paperForward}>
                  <Icon name="md-arrow-dropright"/>
                </Button>
              </Right>
            </Header>

            <View style={styles.headerPanel}>
              <Text style={styles.headerH2}>VOTRE MESSAGE</Text>
            </View>

            <Content padder>

              <Card>
                <CardItem cardBody>
                  <Item>
                  <Input
                    multiline={true}
                    numberOfLines={2}
                    placeholder="Entrer le texte à embosser..."
                    onChangeText={(text) => this.setState({text})}
                    />
                  </Item>
                </CardItem>
              </Card>

              {this.state.text ? <Card><CardItem cardBody><Text style={styles.braille}>{this.state.text}</Text></CardItem></Card> : null}

              {this.state.prompt ?
                <Card>
                <CardItem cardBody>
                  <Item>
                  <Input
                    multiline={true}
                    placeholder="Entrer une nouvelle adresse ip..."
                    onChangeText={(ip) => this.setState({ipAddress: ip})}
                    />
                  </Item>
                </CardItem>
                <CardItem>
                  <Button onPress={this.reconnect}><Text>Reconnexion</Text></Button>
                </CardItem>
              </Card> : null}

            </Content>

            <View style={styles.footer}>
            </View>

            <View style={styles.btnContainer}>
              <Button rounded dark onPress={this.print}>
                <Icon style={styles.sendIcon} name='print'/>
              </Button>
            </View>

            <Fab
              style={styles.fab}
              position="bottomRight"
              onPress={this.voiceRecognition}>
            <Icon name="mic" />
          </Fab>

          </Container>
        </Root>
      </StyleProvider>
    );
  }

}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerPanel: {
    height: 50,
    backgroundColor: "#4F4F4F",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
   color: "#FFF",  
  },
  center: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    height: 45,
    backgroundColor: "#4F4F4F",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -60,
  },
  braille: {
    fontFamily: "BrailleNormal",
    fontSize: 22,
    color: '#333',
    padding: 10,
    lineHeight: 40,
    letterSpacing: 5,
  },
  h2: {
    fontFamily: "RobotoMono",
  },
  headerH2: {
    color: "#FFF",
    fontFamily: "RobotoMono",
  },
  fab: {
    backgroundColor: '#5067FF',
    marginBottom: 20,
  },
  padding: {
    padding: 10,
  }
});