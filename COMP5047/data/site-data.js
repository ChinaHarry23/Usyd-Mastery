window.COMP5047_SITE = {
  courseCode: "COMP5047",
  courseName: "Pervasive Computing",
  courseNameZh: "普适计算",
  term: "S2 2026",
  subtitle: "Ubiquitous computing, sensor-based interaction, Arduino I/O, digital fabrication, gestures, haptics and intelligent interactive systems — distilled from the S2 2026 lecture decks, tutorials and readings.",
  subtitleZh: "普适计算、基于传感器的交互、Arduino 输入输出、数字制造、手势、触觉与智能交互系统——整合自 2026 年第二学期的讲义、辅导课与阅读材料。",
  chapters: [
    {
      number: 1,
      week: 1,
      slug: "chapter1",
      title: "Introduction to Pervasive Computing",
      titleZh: "普适计算导论",
      shortTitle: "Pervasive Intro",
      summary: "What ubiquitous computing is, Weiser's founding vision, context as the core resource, calm technology, and how pervasive systems differ from mobile computing.",
      summaryZh: "什么是普适计算、Weiser 的开创性愿景、作为核心资源的情境、平静技术，以及普适系统与移动计算的区别。",
      status: "Week 1 built from lecture material",
      concepts: ["ubiquitous computing","Weiser's vision","context","calm technology","pervasive vs mobile","interaction design","grounded innovation"],
      conceptsZh: ["普适计算","Weiser 的愿景","情境","平静技术","普适计算与移动计算之别","交互设计","扎根式创新"],
      materials: [
        { label: "Velloso-Intro-to-Pervasive-Computing", file: "Velloso-Intro-to-Pervasive-Computing.pdf" }
      ]
    },
    {
      number: 2,
      week: 2,
      slug: "chapter2",
      title: "Interaction Devices and Techniques",
      titleZh: "交互设备与技术",
      shortTitle: "Devices & Techniques",
      summary: "Input device taxonomies, chunking and phrasing, low-intention and sensor-based interaction, implicit interaction, and proxemic interaction.",
      summaryZh: "输入设备分类法、分块与短语化、低意图交互与基于传感器的交互、隐式交互，以及邻近交互。",
      status: "Week 2 built from lecture material",
      concepts: ["input devices","device taxonomy","chunking & phrasing","implicit interaction","proxemic interaction","feedforward","sensor-based input"],
      conceptsZh: ["输入设备","设备分类法","分块与短语化","隐式交互","邻近交互","前馈","基于传感器的输入"],
      materials: [
        { label: "Velloso-Interaction-Devices-and-Techniques", file: "Velloso-Interaction-Devices-and-Techniques.pdf" }
      ]
    },
    {
      number: 3,
      week: 3,
      slug: "chapter3",
      title: "Digital Input and Output (Arduino Part 1)",
      titleZh: "数字输入与输出（Arduino 第一部分）",
      shortTitle: "Digital I/O",
      summary: "Digital signals, GPIO pins, buttons and LEDs, pull-up and pull-down resistors, debouncing, and building the first breadboard circuits.",
      summaryZh: "数字信号、GPIO 引脚、按键与 LED、上拉与下拉电阻、去抖，以及搭建第一个面包板电路。",
      status: "Week 3 built from lecture material",
      concepts: ["digital signals","GPIO","digitalRead/digitalWrite","pull-up resistors","switch debouncing","breadboard circuits","current limiting"],
      conceptsZh: ["数字信号","GPIO","digitalRead/digitalWrite","上拉电阻","按键去抖","面包板电路","限流"],
      materials: [
        { label: "Velloso-Digital-Input-and-Output-Arduino-Part1", file: "Velloso-Digital-Input-and-Output-Arduino-Part1.pdf" }
      ]
    },
    {
      number: 4,
      week: 4,
      slug: "chapter4",
      title: "Analogue Input and Output (Arduino Part 2)",
      titleZh: "模拟输入与输出（Arduino 第二部分）",
      shortTitle: "Analogue I/O",
      summary: "The analogue world versus discrete sampling, ADC resolution, PWM output, voltage dividers, sensor calibration and serial communication.",
      summaryZh: "模拟世界与离散采样、ADC 分辨率、PWM 输出、分压电路、传感器校准与串口通信。",
      status: "Week 4 built from lecture material",
      concepts: ["analogue vs digital","ADC resolution","PWM","analogRead/analogWrite","voltage dividers","sensor calibration","serial monitor"],
      conceptsZh: ["模拟与数字之别","ADC 分辨率","PWM","analogRead/analogWrite","分压电路","传感器校准","串口监视器"],
      materials: [
        { label: "Velloso-Analogue-Input-and-Output-Arduino-Part2", file: "Velloso-Analogue-Input-and-Output-Arduino-Part2.pdf" }
      ]
    },
    {
      number: 5,
      week: 5,
      slug: "chapter5",
      title: "Digital Fabrication",
      titleZh: "数字制造",
      shortTitle: "Digital Fabrication",
      summary: "Additive and subtractive manufacturing, CAD modelling for fabrication, laser cutting, casting and foam-core prototyping, and choosing fidelity.",
      summaryZh: "增材与减材制造、面向制造环节的 CAD 建模、激光切割、浇铸与泡沫板原型制作，以及如何选择保真度。",
      status: "Week 5 built from lecture material",
      concepts: ["additive manufacturing","subtractive manufacturing","CAD workflow","laser cutting","casting","foam core","prototype fidelity"],
      conceptsZh: ["增材制造","减材制造","CAD 工作流","激光切割","浇铸","泡沫板","原型保真度"],
      materials: [
        { label: "Velloso-Digital-Fabrication", file: "Velloso-Digital-Fabrication.pdf" }
      ]
    },
    {
      number: 6,
      week: 6,
      slug: "chapter6",
      title: "Gestural Interaction",
      titleZh: "手势交互",
      shortTitle: "Gestural Interaction",
      summary: "Mid-air and surface gestures, gesture taxonomies, recognition approaches, and networking a prototype over WiFi and Bluetooth.",
      summaryZh: "空中手势与表面手势、手势分类法、识别方法，以及通过 WiFi 与 Bluetooth 为原型联网。",
      status: "Week 6 built from lecture material",
      concepts: ["gesture taxonomy","mid-air gestures","gesture recognition","social acceptability","WiFi networking","Bluetooth / BLE","ESP32"],
      conceptsZh: ["手势分类法","空中手势","手势识别","社会可接受性","WiFi 联网","Bluetooth / BLE","ESP32"],
      materials: [
        { label: "Velloso-Gestural-Interaction", file: "Velloso-Gestural-Interaction.pdf" }
      ]
    },
    {
      number: 7,
      week: 7,
      slug: "chapter7",
      title: "Haptic Interaction",
      titleZh: "触觉交互",
      shortTitle: "Haptic Interaction",
      summary: "Haptic perception, vibrotactile and force feedback, actuator families, driving motors safely, and haptic design for everyday interfaces.",
      summaryZh: "触觉感知、振动触觉反馈与力反馈、执行器类别、安全驱动电机，以及面向日常界面的触觉设计。",
      status: "Week 7 built from lecture material",
      concepts: ["haptic perception","vibrotactile feedback","force feedback","actuators","motor drivers","PWM speed control","haptic design guidelines"],
      conceptsZh: ["触觉感知","振动触觉反馈","力反馈","执行器","电机驱动","PWM 调速","触觉设计准则"],
      materials: [
        { label: "Velloso-Haptic-Interaction", file: "Velloso-Haptic-Interaction.pdf" }
      ]
    },
    {
      number: 8,
      week: 8,
      slug: "chapter8",
      title: "Intelligent Interactive Systems",
      titleZh: "智能交互系统",
      shortTitle: "Intelligent Systems",
      summary: "Embedding inference in interactive products, human-AI interaction guidelines, calling APIs from a device, and the ethics of proactive systems.",
      summaryZh: "在交互产品中嵌入推理、人机智能交互准则、从设备调用 API，以及主动式系统的伦理问题。",
      status: "Week 8 built from lecture material",
      concepts: ["human-AI interaction","model inference","APIs","sensing pipeline","proactivity","over-trust & automation bias","privacy"],
      conceptsZh: ["人机智能交互","模型推理","API","感知流水线","主动性","过度信任与自动化偏见","隐私"],
      materials: [
        { label: "Velloso-Intelligent-Interactive-Systems", file: "Velloso-Intelligent-Interactive-Systems.pdf" }
      ]
    }
  ]
};
