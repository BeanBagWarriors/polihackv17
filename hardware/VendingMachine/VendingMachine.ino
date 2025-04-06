#include <WiFi.h>
#include <HTTPClient.h>

// Replace with your WiFi credentials
const char* ssid     = "cometa";
const char* password = "parolafaina";

const char* machineId = "123D"; // Unique machine ID
const int irSensorPin = 32; // IR sensor input pin

// Replace with your server endpoint
const char* serverUrl = "https://webhook.site/cca3ce70-9f8b-4c2a-aa69-1c8999c8ea81/api/machine";

struct Button {
  int pin;
  const char* id;
  bool lastState;
};

Button  buttons[] = {
  {34,"A1",HIGH},
  {35,"A2",HIGH},
  {33,"A3",HIGH},
  {25,"A4",HIGH}
};

const int buttonCount = sizeof(buttons)/sizeof(buttons[0]);

bool irLastState = HIGH;

void setup() {
  Serial.begin(115200);

  for (int i = 0; i < buttonCount; i++) {
    pinMode(buttons[i].pin, INPUT_PULLUP);
  }

  pinMode(irSensorPin, INPUT_PULLUP);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected!");
  sendStartupInfo();
}

void loop() {
  for (int i = 0; i < buttonCount; i++) {
    bool currentState = digitalRead(buttons[i].pin);
    
    // Detect button press (active LOW)
    if (buttons[i].lastState == HIGH && currentState == LOW) {
      Serial.printf("Button %s pressed!\n", buttons[i].id);
      sendButtonPress(buttons[i].id);
    }

    buttons[i].lastState = currentState;
  }

  bool irCurrentState = digitalRead(irSensorPin);
  if (irLastState == HIGH && irCurrentState == LOW) {
    Serial.println("IR sensor triggered — likely full.");
    sendFullAlert();
  }
  irLastState = irCurrentState;

  delay(50); // Debounce delay
}

void sendStartupInfo() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(serverUrl) + "/createMachine";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"id\":\"" + String(machineId) + "\",\"keys\":[";
    for (int i = 0; i < buttonCount; i++) {
      payload += "\"" + String(buttons[i].id) + "\"";
      if (i < buttonCount - 1) payload += ",";
    }
    payload += "],\"location\":\"46.783178,23.6064414\"}";

    Serial.println("Sending startup info: " + payload);
    int code = http.POST(payload);
    Serial.printf("Startup HTTP Response Code: %d\n", code);
    http.end();
  }
}


void sendButtonPress(const char* buttonId) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(serverUrl) + "/removeItemsFromContent";
    http.begin(url); // Base URL
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"id\":\"" + String(machineId) + "\",\"key\":\"" + String(buttonId) + "\"}";
    int code = http.POST(payload);
    Serial.printf("Button Press HTTP Response Code: %d\n", code);
    http.end();
  }
}

void sendFullAlert() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(serverUrl) + "/updateMachineStockMoney";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"id\":\"" + String(machineId) + "\"}";
    int code = http.POST(payload);
    Serial.printf("Full Alert HTTP Response Code: %d\n", code);
    http.end();
  }
}