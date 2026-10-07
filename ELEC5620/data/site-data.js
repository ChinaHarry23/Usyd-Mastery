window.ELEC5620_SITE = {
  courseCode: "ELEC5620",
  courseName: "Model-Based Software Engineering",
  courseNameZh: "基于模型的软件工程",
  term: "S2 2026",
  subtitle: "Requirements, architecture, structure and behaviour expressed as models — UML in practice, model organisation, and agile model-driven development, built from the S2 2026 lecture decks, tutorials and labs.",
  subtitleZh: "以模型表达需求、架构、结构与行为——UML 实战、模型组织，以及敏捷模型驱动开发，基于 2026 年第二学期的讲义、辅导课与实验构建。",
  chapters: [
    {
      number: 1,
      week: 1,
      slug: "chapter1",
      title: "Week 1: Introduction to Model-Based Software Engineering",
      titleZh: "基于模型的软件工程导论",
      shortTitle: "Introduction to MBSE",
      summary: "Why software engineering needs models, what a model actually buys you, how MBSE differs from code-first development, and the shape of the course project.",
      summaryZh: "软件工程为什么需要模型、模型究竟能带来什么、MBSE 与代码优先开发的区别，以及课程项目的整体形态。",
      status: "Week 1 built from lecture material",
      concepts: ["model","abstraction","MBSE","UML overview","model-driven engineering","project lifecycle","essential vs accidental complexity"],
      conceptsZh: ["模型","抽象","MBSE","UML 概览","模型驱动工程","项目生命周期","本质复杂性 vs 偶然复杂性"],
      materials: [
        { label: "Week1-Introduction", file: "Week1-Introduction.pdf" }
      ]
    },
    {
      number: 2,
      week: 2,
      slug: "chapter2",
      title: "Week 2: Introduction to MBSE Practice",
      titleZh: "MBSE 实践导论",
      shortTitle: "MBSE in Practice",
      summary: "How modelling works in a real project: viewpoints, levels of abstraction, the tooling ecosystem, traceability and what makes a model good enough.",
      summaryZh: "建模在真实项目中如何运作：视角、抽象层次、工具生态、可追溯性，以及模型做到什么程度才算足够好。",
      status: "Week 2 built from lecture material",
      concepts: ["viewpoints","metamodel","model repository","modelling tools","traceability","model quality","levels of abstraction"],
      conceptsZh: ["视角","元模型","模型仓库","建模工具","可追溯性","模型质量","抽象层次"],
      materials: [
        { label: "Week2-Introduction-to-MBSE", file: "Week2-Introduction-to-MBSE.pdf" }
      ]
    },
    {
      number: 3,
      week: 3,
      slug: "chapter3",
      title: "Week 3: Requirement Modelling",
      titleZh: "需求建模",
      shortTitle: "Requirement Models",
      summary: "Capturing what the system must do: actors, use cases, include and extend relationships, non-functional requirements and scenario walkthroughs.",
      summaryZh: "捕获系统必须完成的事情：参与者、用例、包含与扩展关系、非功能需求以及场景走查。",
      status: "Week 3 built from lecture material",
      concepts: ["actors","use cases","include & extend","use case diagram","non-functional requirements","scenarios","requirements traceability"],
      conceptsZh: ["参与者","用例","包含与扩展","用例图","非功能需求","场景","需求可追溯性"],
      materials: [
        { label: "Week3-Requirement-Model", file: "Week3-Requirement-Model.pdf" }
      ]
    },
    {
      number: 4,
      week: 4,
      slug: "chapter4",
      title: "Week 4: Architectural Design and Modelling",
      titleZh: "架构设计与建模",
      shortTitle: "Architecture Models",
      summary: "Structuring a system before you build it: components and interfaces, packages, deployment, layered architecture and documenting architectural views.",
      summaryZh: "在动手构建之前先组织系统结构：构件与接口、包、部署、分层架构，以及架构视图的文档化。",
      status: "Week 4 built from lecture material",
      concepts: ["component diagrams","interfaces & ports","packages","deployment diagrams","layered architecture","architectural views","design rationale"],
      conceptsZh: ["构件图","接口与端口","包","部署图","分层架构","架构视图","设计依据"],
      materials: [
        { label: "Week4-Architectural-Design-and-Modeling-Part1", file: "Week4-Architectural-Design-and-Modeling-Part1.pdf" },
        { label: "Week4-Architectural-Design-and-Modeling-Part2", file: "Week4-Architectural-Design-and-Modeling-Part2.pdf" }
      ]
    },
    {
      number: 5,
      week: 5,
      slug: "chapter5",
      title: "Week 5: Modelling Structure",
      titleZh: "结构建模",
      shortTitle: "Modelling Structure",
      summary: "Class modelling in depth: associations and their adornments, aggregation and composition, generalisation, multiplicity, invariants and OCL constraints.",
      summaryZh: "深入类建模：关联及其修饰、聚合与组合、泛化、多重度、不变式与 OCL 约束。",
      status: "Week 5 built from lecture material",
      concepts: ["class diagrams","association & aggregation","composition","generalisation","multiplicity","invariants","OCL constraints"],
      conceptsZh: ["类图","关联与聚合","组合","泛化","多重度","不变式","OCL 约束"],
      materials: [
        { label: "Week5-Modeling-Structure-Part1", file: "Week5-Modeling-Structure-Part1.pdf" },
        { label: "Week5-Modeling-Structure-Part2", file: "Week5-Modeling-Structure-Part2.pdf" }
      ]
    },
    {
      number: 6,
      week: 6,
      slug: "chapter6",
      title: "Week 6: Modelling Behaviour",
      titleZh: "行为建模",
      shortTitle: "Modelling Behaviour",
      summary: "Expressing dynamics: activity diagrams with control flow, sequence diagrams with lifelines and messages, and state machines with events and guards.",
      summaryZh: "表达动态行为：带控制流的活动图、含生命线与消息的顺序图，以及带事件与守卫条件的状态机。",
      status: "Week 6 built from lecture material",
      concepts: ["activity diagrams","control & object flow","sequence diagrams","lifelines & messages","state machines","events & guards","interaction overview"],
      conceptsZh: ["活动图","控制流与对象流","顺序图","生命线与消息","状态机","事件与守卫条件","交互概览图"],
      materials: [
        { label: "Week6-Modeling-Behavior", file: "Week6-Modeling-Behavior.pdf" }
      ]
    },
    {
      number: 7,
      week: 7,
      slug: "chapter7",
      title: "Week 7: Model Organisation",
      titleZh: "模型组织",
      shortTitle: "Model Organisation",
      summary: "Keeping a large model usable: namespaces and packages, reuse and model libraries, profiles and stereotypes, versioning and consistency rules.",
      summaryZh: "让大型模型保持可用：命名空间与包、复用与模型库、剖面与构造型、版本管理与一致性规则。",
      status: "Week 7 built from lecture material",
      concepts: ["model organisation","namespaces & packages","model reuse","profiles & stereotypes","model libraries","versioning","consistency rules"],
      conceptsZh: ["模型组织","命名空间与包","模型复用","剖面与构造型","模型库","版本管理","一致性规则"],
      materials: [
        { label: "Week7-Model-Organisation", file: "Week7-Model-Organisation.pdf" }
      ]
    },
    {
      number: 8,
      week: 8,
      slug: "chapter8",
      title: "Week 8: Agile Model Practice",
      titleZh: "敏捷模型实践",
      shortTitle: "Agile Model Practice",
      summary: "Modelling without the ceremony: agile modelling values, executable and testable models, code generation, and keeping models alive across iterations.",
      summaryZh: "去掉繁文缛节的建模：敏捷建模价值观、可执行且可测试的模型、代码生成，以及让模型在迭代中持续存活。",
      status: "Week 8 built from lecture material",
      concepts: ["agile modelling","executable models","code generation","model testing","lightweight modelling","iterative modelling","model-code round trip"],
      conceptsZh: ["敏捷建模","可执行模型","代码生成","模型测试","轻量级建模","迭代式建模","模型与代码双向同步"],
      materials: [
        { label: "Week8-Agile-Model-Practice", file: "Week8-Agile-Model-Practice.pdf" }
      ]
    }
  ]
};
