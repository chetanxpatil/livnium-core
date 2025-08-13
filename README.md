[//]: # (# Livnium Core)

[//]: # ()
[//]: # (> A spatial operating system for symbolic computation and intentional geometry.)

[//]: # ()
[//]: # (© 2025 Chetan Patil — Licensed under)

[//]: # ([CC BY 4.0]&#40;https://creativecommons.org/licenses/by/4.0/&#41;)

[//]: # ()
[//]: # (## v1.2 Highlights)

[//]: # ()
[//]: # (- Clean radix‑27 number system with tail‑sentinel BigInt encoding)

[//]: # (- Clarified energy model and face‑only visibility principle)

[//]: # (- Coupler field utilities and interference demos)

[//]: # (- Added 2×2 seed tier and scale ladder bridges)

[//]: # ()
[//]: # (## Introduction)

[//]: # ()
[//]: # (Imagine a language written not on paper, but in space. Picture a 3×3×3 lattice of symbols floating before you, each piece carrying meaning by where it sits and what faces it shows. At the very center of this lattice resides a silent observer symbol, **Om &#40;0&#41;**, anchoring the system like a calm eye in a storm. This is **Livnium Core** – a novel symbolic language for computational expression, a playground where data and ideas live in a structured cube of 27 units.)

[//]: # ()
[//]: # (Livnium Core began as a thought experiment: *What if computation could be tangible, spatial, even philosophical?* Instead of linear code or abstract math alone, Livnium expresses information as a **spatial arrangement of symbols**. You don’t just write Livnium – you **build** it, twist it, and watch meaning transform from one configuration to another. In Livnium, logic has a geometry, and every rotation is a story. It’s not a puzzle to solve or a toy to tinker with, but a self-contained conceptual framework — a little universe of 27 symbols where patterns and rotations convey computations and insights.)

[//]: # ()
[//]: # (In this README, we’ll embark on the story of Livnium Core. We’ll explore the motivations that led to its creation &#40;personal curiosities, philosophical questions, and technical ambitions&#41;, then dive into the fundamentals: the 27-symbol alphabet and base-27 encoding that form its language. We’ll see how **spatial logic** and **exposure-based symbolic energy** give Livnium its unique character, and how **rotational operations** define its reversible “grammar” of transformations. Beyond the technicalities, we’ll highlight how Livnium is more than just code – it’s a way of seeing and organizing meaning in structured space. Finally, you’ll learn how to get your hands on the Dart implementation and run the provided test functions, and we’ll conclude with a vision of where this could all lead – perhaps even toward a new kind of metaphysical logic engine.)

[//]: # ()
[//]: # (Let’s begin this journey into the heart of a little cube teeming with symbols and possibilities.)

[//]: # ()
[//]: # (## Motivation: Why Livnium?)

[//]: # ()
[//]: # (**Personal Spark:** Livnium Core was born from a personal fascination with patterns and the idea of **finding order in chaos**. Its creator often pondered puzzles and cubes as a child &#40;countless hours spent twisting objects in hand and mind&#41;, and later realized that there was something profound in that spatial dance of pieces. What if those dances of colored faces were telling a story or computing something? The urge to create a *personal symbolic system* – one that felt alive and self-originated – became a driving force. Livnium started as a very personal quest to merge play with purpose: to take a simple 3×3×3 structure and imbue it with meaning beyond mere games.)

[//]: # ()
[//]: # (**Philosophical Curiosity:** At a deeper level, Livnium is motivated by a philosophical question: *Can meaning be encoded in space in a way that echoes our metaphysical ideas?* The presence of the **Om** at the center is no accident – in many philosophies &#40;especially Eastern thought&#41;, *Om* represents the fundamental vibration of the universe, the observer, the unity of all things. In Livnium Core, Om &#40;0&#41; anchors the system as the central observer symbol, a reminder that at the core of any complex system there is an essence or witness. Surrounding this center, the 26 other symbols can be seen as emanations or facets of reality, each with their own place and role. The design encourages one to think of knowledge as **spatial** and **contextual** – each symbol’s meaning arises from its position relative to others and to the center. This reflects a worldview: just as an idea’s meaning depends on context, Livnium’s symbols derive meaning from where and how they are placed. The philosophical motivation is to create **a structured space of meaning**, a little cosmos where an observer &#40;Om&#41; sees the interplay of fundamental elements. In a way, Livnium is an attempt to capture a *microcosm of logic* – a space where **the form is the content**.)

[//]: # ()
[//]: # (**Technical Ambition:** On the technical side, Livnium Core is an exploration into alternative computing paradigms. Traditional computing relies on linear sequences of bits &#40;binary 1s and 0s&#41; or maybe higher bases like hex; but what about base-27? With 27 distinct symbols, Livnium provides a **base-27 encoding system** that vastly expands representational capacity per “digit.” The 3×3×3 grid is not just a random choice – it’s the smallest cube that has an interior and layers, offering a rich structure &#40;27 units&#41; while still being human-conceptualizable. Technically, Livnium delves into **spatial data representation**: instead of one-dimensional arrays or even two-dimensional matrices, it uses a **three-dimensional matrix** of symbols. This structure can encode data in ways that linear memory cannot – for example, a single Livnium configuration can be thought of as a 27-digit base-27 number or as a multidimensional state with adjacency relationships. The system’s **rotational operations** are analogous to functions or algorithms acting on data, but with a guarantee of reversibility &#40;nothing gets deleted, only moved&#41;. This hints at potential links to reversible computing and group theory in mathematics. In summary, the technical motivation is to pioneer a new kind of symbolic computation: one that is **spatial, multi-base, and inherently reversible**, possibly opening doors to new algorithms or educational tools for visualizing computation.)

[//]: # ()
[//]: # (## The 27-Symbol Alphabet and Base-27 Encoding)

[//]: # ()
[//]: # (At the heart of Livnium Core lies its **alphabet of 27 symbols**. These symbols are the “letters” of Livnium’s language, and together they enable a base-27 numeral system for encoding information. Each symbol corresponds to one of the **27 units in the 3×3×3 grid**. We label them with the numbers **0 through 26** for convenience, where **0 is the special symbol ‘Om’** at the center, and 1–26 are the others surrounding it. You can think of 0–26 as unique IDs or values, each occupying a distinct position in the core structure.)

[//]: # ()
[//]: # (Here is one intuitive way to break down the 27 symbols and their spatial roles:)

[//]: # ()
[//]: # (* **0 – “Om”:** The central observer symbol. It resides in the exact center of the 3×3×3 lattice. Om acts as the anchor and reference point for the entire system. It’s like the **origin** of the coordinate system and the silent witness to all symbolic interactions around it.)

[//]: # ()
[//]: # (* **1–6 – Face Centers:** Six symbols occupy the center of each face of the outer cube &#40;front, back, left, right, top, bottom&#41;. Each of these units has exactly one outer face exposed. They can be thought of as representing the six cardinal directions or fundamental axes of the system. In the Livnium alphabet, we could assign them simple labels or letters, but numerically they’re 1 through 6\. These six are the “primary directions” emanating from Om along the X, Y, and Z axes &#40;positive and negative&#41;. For example, one might imagine symbol 1 is on the front face center, 2 on the back face center, 3 on the left face center, and so on – though the numbering is arbitrary unless we define a convention.)

[//]: # ()
[//]: # (* **7–18 – Edge Units:** Twelve symbols lie along the edges of the cube, each sandwiched between two face-center symbols. An edge unit has two of its faces exposed on the outside. These symbols &#40;7 through 18 in our numbering&#41; conceptually **connect pairs of fundamental axes**. For instance, one edge piece might sit between the top and front face &#40;carrying aspects of both “top” and “front” in whatever meaning we assign&#41;. Each edge symbol thus blends two directions or categories. There are 12 edges on a cube, hence 12 symbols in this group.)

[//]: # ()
[//]: # (* **19–26 – Corner Units:** Eight symbols occupy the corners of the cube. Each corner touches three faces, so a corner unit has three outer faces exposed. In the numbering scheme, 19–26 cover these eight corners &#40;we have 8 numbers for them, which means 2 of the numbers between 19 and 26 won’t be used if we strictly go by count; but remember, the numbering 1–26 is an arbitrary labeling – one could also label the symbols differently&#41;. Each corner symbol represents the **intersection of three fundamental directions**. They are the most “complex” symbols in terms of exposure, combining three different face orientations. Corner units sit at the triad junctions of the cube &#40;e.g., top-front-left corner, etc.&#41;, making them rich in context.)

[//]: # ()
[//]: # (Together, these 27 symbols form the full alphabet of Livnium. In terms of encoding, any piece of data or state of the system can be expressed using these symbols as digits in **base-27**. For example, if you wanted to encode a number in base-27, you would use the digits 0–9 and A–Q &#40;since there are 27 symbols, we need 27 characters – one common convention after 0-9 is to use letters A=10, B=11, ..., Q=26&#41;. In the Livnium Core context, we typically just refer to the symbols by their numeric IDs or by custom names if given. The key point is: **base-27 means each “place” in a number can hold 27 possible values instead of 10 &#40;decimal&#41; or 2 &#40;binary&#41;**. This gives a single Livnium “digit” much more expressive power.)

[//]: # ()
[//]: # (How does this help us with the core’s configuration? Think of listing out all 27 symbols in a specific order &#40;say, layer by layer through the 3D grid&#41;. That would give a sequence of 27 values. This sequence can be seen as a 27-digit number in base-27, uniquely identifying that configuration. In theory, every distinct arrangement of symbols in the Livnium Core corresponds to a unique base-27 number &#40;though not every base-27 number is a valid arrangement if we consider the symbols fixed as a set&#41;. This encoding system underlines how Livnium can map spatial arrangements to data: the **state** of the core *is* information.)

[//]: # ()
[//]: # (In summary, the Livnium alphabet is a **27-letter language** where each letter’s “shape” is its position in space. It’s a rich set of symbols – far more than the binary of computers or the 4-letter DNA of life – and it provides the canvas on which Livnium’s logic is written.)

[//]: # ()
[//]: # (## Spatial Logic: Structure as Expression)

[//]: # ()
[//]: # (In Livnium Core, **space itself is the syntax**. The arrangement of symbols in the 3×3×3 grid isn’t just a passive holding pattern; it actively encodes logical relationships. We call this **spatial logic** – the idea that where a symbol is, and what neighbors it has, affects what it means.)

[//]: # ()
[//]: # (Consider how traditional languages or codes work: in text, meaning comes from sequence &#40;the order of words or tokens&#41;; in graphs, meaning comes from connections; in Livnium, meaning emerges from **position and adjacency** in three-dimensional space. A few ways to think about Livnium’s spatial logic:)

[//]: # ()
[//]: # (* **Context by Position:** A symbol on the top face of the cube can be interpreted differently from the same symbol on the bottom face. Each face or layer of the structure can be assigned a contextual meaning. For example, we might decide the top layer of the core represents “abstract ideas” and the bottom layer “concrete reality” &#40;just as a storytelling device&#41;. In that case, a symbol placed in the top-front-right corner might represent an idea that is abstract &#40;top layer&#41;, forward-looking &#40;front face&#41;, and perhaps positive &#40;right face&#41;. The exact interpretations are up to the user or the application domain, but Livnium provides a **framework to assign meaning to directions and positions**.)

[//]: # ()
[//]: # (* **Adjacency and Relationships:** Symbols that sit next to each other &#40;sharing a face or an edge&#41; can be seen as having a direct relationship. For instance, if symbol X and symbol Y share a face on the core’s surface, one could interpret that as “X influences Y” or “X and Y are in harmony” depending on the intended semantics. The cube structure is essentially a network: each unit touches certain others. This allows representation of binary relationships &#40;edges between units&#41;, ternary relationships &#40;corners where three meet&#41;, etc., in a very visual, tangible way. Livnium’s logic can capture something like “X lies between A and B” by literally having X’s unit physically located between units A and B in the grid.)

[//]: # ()
[//]: # (* **Axes as Dimensions of Meaning:** The three spatial axes &#40;X, Y, Z corresponding to left-right, front-back, up-down in the cube&#41; can be treated as independent dimensions of meaning. For example, one might decide:)

[//]: # ()
[//]: # (* X-axis &#40;left ↔ right&#41; represents a spectrum of a certain property &#40;say, *negative* to *positive* influence&#41;.)

[//]: # ()
[//]: # (* Y-axis &#40;front ↔ back&#41; represents another spectrum &#40;e.g., *past* to *future* orientation, or *private* to *public*&#41;.)

[//]: # ()
[//]: # (* Z-axis &#40;down ↔ up&#41; represents yet another &#40;perhaps *fundamental* to *transcendent*, or *material* to *spiritual*&#41;. Under such an interpretation, each of the 27 positions in the Livnium Core encodes a unique combination of these three attributes. The center Om &#40;0,0,0 coordinate&#41; then represents the **neutral balance** of all dimensions &#40;neither left nor right, neither up nor down, etc.&#41;, which is fitting for an observer. A corner piece, say at &#40;X+, Y+, Z+&#41;, would represent an extreme combination of the positive ends of all three chosen spectra. In this way, Livnium’s spatial logic lets you encode a *conceptual space* of possibilities. Each symbol becomes a vector in a meaning-space.)

[//]: # ()
[//]: # (* **Whole as Context:** The fact that all symbols coexist in a single 3D arrangement means the *whole state* can be interpreted at once. This is different from a list of symbols or a linear code where you parse sequence. Here, meaning can be a *gestalt* – a pattern on a face, a symmetry in the arrangement, an emptiness at certain spot – all these holistic spatial features can carry information. For example, a symmetric arrangement of certain symbols across the core might signify equilibrium or harmony, whereas a very uneven distribution might signify tension or imbalance in whatever domain is being modeled.)

[//]: # ()
[//]: # (Livnium’s spatial logic is powerful because it forces us to think in terms of **relationships and structures** rather than just values. It’s like a language where **grammar is geometry**. To read a Livnium Core configuration is to inspect a structure: you see which symbol is at the forefront, which one is hidden, which ones cluster together, which axis is emphasized by the positions of certain symbols, and so on. This makes Livnium not just a data structure but a true *diagram of logic*. Problems or scenarios encoded in Livnium might reveal solutions by spatial intuition – sometimes literally by looking at the “shape” of the arrangement.)

[//]: # ()
[//]: # (## Symbolic Energy: Visibility and Exposure)

[//]: # ()
[//]: # (One of the most intriguing concepts in Livnium Core is that of **symbolic energy**, a measure based on a unit’s visibility or exposure. In a physical sense, some pieces of the 3×3×3 structure are more “exposed” &#40;on the surface&#41; while others are buried inside. Livnium abstracts this into a notion of energy: the more faces of a unit are outwardly visible, the more symbolic energy that unit has.)

[//]: # ()
[//]: # (Here’s how we quantify it: \- **Corner units &#40;3 faces visible&#41;:** Energy \= 3\. These are the high-energy symbols, sticking out into the world on three sides. They are like extroverts of the system – highly exposed and interacting with three different faces/environments. \- **Edge units &#40;2 faces visible&#41;:** Energy \= 2\. They have moderate energy, showing two faces to the outside. They often act as links or mediators between the domains of the two faces they touch. \- **Face-center units &#40;1 face visible&#41;:** Energy \= 1\. With only one outer face, these symbols are relatively low-energy; they present only one aspect of themselves to the outside, keeping the rest of their facets internal. \- **The Om center &#40;0 faces visible&#41;:** Energy \= 0\. The central Om is completely hidden from the outside – it doesn’t directly expose any face. In terms of energy, it’s at rest, the calm zero-point. One might say it has a *potential* energy or a meta-energy, but visibly it’s neutral. It fuels the system not by outward exposure but by being the still center that everything rotates around.)

[//]: # ()
[//]: # (From this breakdown, one can calculate that the total “symbolic energy” distributed in the system at any time is constant:  )

[//]: # (There are 8 corner units × 3 energy each \= 24,  )

[//]: # (12 edge units × 2 energy each \= 24,  )

[//]: # (6 face-centers × 1 energy each \= 6,  )

[//]: # (1 center × 0 energy \= 0\.  )

[//]: # (Summing up: **24 \+ 24 \+ 6 \= 54** total visible faces &#40;or energy units&#41;. No matter how you rotate or rearrange the Livnium Core &#40;using legitimate rotations&#41;, this total remains 54 – a conserved quantity. This is analogous to conservation of energy in physics; here we have a **conservation of symbolic exposure**. The energy isn’t created or destroyed by rotations; it simply moves around which pieces carry it.)

[//]: # ()
[//]: # (Why is this meaningful? In Livnium, energy can be thought of as a proxy for **significance or activity**. A symbol with energy 3 &#40;corner&#41; is actively participating in three contexts simultaneously, whereas Om with energy 0 is a silent witness. One might interpret high-energy symbols as *highly involved components* of the current state or problem – they literally stick out. Low-energy symbols might represent more internal, hidden factors. For example, if you were modeling a scenario and a particular symbol &#40;say representing a person or a concept&#41; ended up in a corner position, it’s highly exposed – perhaps indicating that concept is very prominent or influential in the scenario. If another symbol is tucked away on a face-center, it’s only contributing on one front.)

[//]: # ()
[//]: # (The **exposure-based energy computation** can also inspire dynamic processes: one could imagine algorithms that “seek a lower energy state” by moving certain symbols inward &#40;solving something by metaphorically hiding some aspects&#41; or a higher energy state by pushing key symbols outward. Because Livnium’s moves are rotations &#40;which don’t actually change energy distribution per type of piece&#41;, such processes might involve conceptual moves beyond simple rotations &#40;perhaps swapping pieces’ roles&#41;. However, even within just rotations, we can track how energy flows from one symbol to another. For example, if a corner piece moves to an edge position after some rotation, that means a different symbol has taken that corner – effectively, the energy “moved” to a new symbol. Tracing this can tell us how the prominence of certain symbols changes through transformations.)

[//]: # ()
[//]: # (In a more metaphoric sense, **Om at energy 0** being the center suggests a system where the core principle &#40;Om&#41; doesn’t need to be outwardly visible to hold everything together. Meanwhile, the hustle and bustle happens at the edges and corners – the interface points with the outside “world”. This resonates with the idea that sometimes the most important element of a system is not loud or externally apparent, yet it anchors everything.)

[//]: # ()
[//]: # (To summarize, symbolic energy in Livnium Core gives us a quantitative way to discuss the qualitative idea of **visibility and influence**. It’s a built-in metric that enriches the language: any Livnium configuration can be analyzed not just for which symbols are where, but for how much exposure each symbol has. And that is a piece of information we can use in interpreting or debugging the state of the system.)

[//]: # ()
[//]: # (## Rotational Symmetry and Reversibility)

[//]: # ()
[//]: # (Livnium Core’s only allowed manipulations are **rotations** – and this is by design. Rotations of the 3×3×3 structure &#40;or sections of it&#41; are the “operations” or “verbs” of this symbolic language. Why rotations? Because rotations are **structural permutations** that preserve the integrity of the system while redistributing its components. And crucially, every rotation in Livnium is **reversible**.)

[//]: # ()
[//]: # (Let’s break down the rotational properties:)

[//]: # ()
[//]: # (* **Face Rotations:** You can rotate any of the three layers around any of the three axes &#40;imagine twisting one face of the cube 90° clockwise, for example&#41;. This will move 9 of the symbols &#40;a 3×3 face layer&#41; to new positions while keeping the others in place. A face rotation in Livnium is like applying a specific function or transformation to the state – it scrambles certain parts in a controlled way. Importantly, if you rotate that face back 90° counter-clockwise, you undo the operation exactly. This is what we mean by **rotational reversibility** on a local scale: each basic transformation has an inverse. The system doesn’t allow any operation that can’t be undone by another valid operation.)

[//]: # ()
[//]: # (* **Whole-System Rotations:** You can also rotate the entire core structure in space &#40;turn the whole cube around an axis&#41;. This doesn’t change the relative arrangement of symbols internally &#40;it’s like just changing your viewpoint&#41;, but it’s worth noting because Livnium doesn’t consider two orientations of the entire core as different states if no relative positions changed. In other words, the core has a certain **symmetry**: rotating the entire system 90° around center yields a state that might be considered equivalent in meaning &#40;since all relationships are preserved, only our perspective changed&#41;. This can be leveraged in interpretations – for example, a pattern might look the same on multiple faces due to a symmetry, indicating some invariant property.)

[//]: # ()
[//]: # (* **Group Structure:** The set of all possible rotations &#40;quarter-turns, half-turns, etc. of faces, plus combos&#41; forms a mathematical group. Without diving too deep into group theory, this means that performing rotations in sequence is like composing functions – you can always do another rotation, or undo one, and any sequence can be reversed. There is a notion of an identity operation &#40;do nothing&#41; and inverses &#40;rotate back&#41;. This is powerful for computation because it implies **no information is ever lost or created – just rearranged**. If a particular sequence of rotations encodes some computation or solution-finding process, you can always invert that sequence to get back to the starting configuration, verifying the result or exploring alternate paths. In a sense, Livnium’s operations are inherently **debug-friendly**: you can trace back your steps at any time.)

[//]: # ()
[//]: # (* **Rotational Invariants:** Even though rotations change which symbol is where, certain things remain invariant &#40;unchanged&#41;. We already noted total symbolic energy &#40;54&#41; is invariant. Another invariant is the presence of Om at the center – no rotation will ever move Om from the center spot, because by definition rotations pivot around that central unit. &#40;Om truly is an anchor: the rotations happen *around* it, not involving it.&#41; Also, the set of corner pieces remains corners, edges remain edges, etc., under face rotations. This means the energy *distribution by piece type* &#40;corner, edge, face, center&#41; is invariant under legal moves. These invariants are like conservation laws or facts of life in the Livnium world, and they can be used as checks – for example, if someone tries an operation that would put a corner piece into an edge position, that operation is not a valid rotation in the defined system &#40;it would be something else, like dismantling the core, which Livnium doesn’t count as a basic operation&#41;.)

[//]: # ()
[//]: # (* **Meaning of Rotations:** On a more interpretive note, you can think of rotations as *actions or transformations on meaning*. If the core’s state encodes some situation or data, a rotation could represent a change or an event that reconfigures that situation. Because rotations are reversible, these changes are not like erasing a piece of text and writing a new one &#40;where the old text is gone&#41; – instead, it’s like rotating a sculpture: you get a new view or arrangement, but you could always rotate it back to the previous view. This encourages thinking of Livnium operations as **explorations of state space** rather than one-way transitions. It’s akin to exploring all sides of a problem: you might rotate the configuration to see it from another angle, then rotate back if it’s not yielding insights, with nothing lost in between.)

[//]: # ()
[//]: # (In practice, working with Livnium often means defining a sequence of rotations to achieve a goal state from a start state &#40;very much like solving a cube, though here we frame it as performing a meaningful computation&#41;. Because of rotational reversibility, any algorithm or process you devise in Livnium Core is inherently invertible. This could have intriguing implications – for instance, could Livnium operations be used to implement reversible logic circuits or computations? Possibly, yes, with the right interpretation layer on top.)

[//]: # ()
[//]: # (To summarize, **rotational properties** give Livnium Core its dynamic character. They ensure that while the structure is rigid enough to maintain certain invariants &#40;like energy distribution, the anchored center, etc.&#41;, it’s fluid enough to represent change and process. Every twist is deliberate and safe – you can always retrace your steps. In the world of Livnium, to compute is to rotate, to change is to move things around an eternal center, and nothing meaningful ever vanishes – it just moves to a new place.)

[//]: # ()
[//]: # (## Beyond Code: A New Way of Seeing)

[//]: # ()
[//]: # (Livnium Core is not just a code or a gimmicky encoding – it’s fundamentally **a way of seeing and organizing meaning**. By externalizing information into a 3D structure, it challenges us to think differently about problems and systems. In essence, Livnium encourages **spatial thinking** in domains where we usually use linear thinking.)

[//]: # ()
[//]: # (Consider how you might normally approach a complex idea or problem: you might list factors, draw connections, or write equations. With Livnium, you **build a model of the idea** in the core. You place symbols &#40;factors, variables, concepts&#41; in relation to each other. You leverage the physical intuition of balance, proximity, inside/outside, to represent abstract relationships. This can be incredibly eye-opening. Suddenly, you’re not just *writing* meaning, you are *architecting* it.)

[//]: # ()
[//]: # (The presence of the Om observer symbol at the center of every configuration is a philosophical statement: any representation of meaning implicitly has an observer or a reference frame. Livnium makes that explicit. It reminds us that our organization of knowledge always has a point of view &#40;even if it’s the all-seeing central one&#41;. In practical terms, this means Livnium could be used as a tool to think about context and perspective. For example, if you treat Om as “my perspective” and arrange symbols around it, you are effectively making a model of how you see a situation, with things closer or more exposed meaning they are more in your attention or influence.)

[//]: # ()
[//]: # (Livnium is also a new way of **organizing information**. Imagine using Livnium Cores as building blocks themselves: each core could represent a concept or a dataset, and you might connect cores &#40;just as pieces within a core connect&#41; to form a higher-level structure. This fractal or hierarchical possibility hints at Livnium scaling into a knowledge organization system. It’s like an extension of mind-mapping or concept mapping, but in 3D and with an inherent logic and set of operations. By organizing information in a Livnium Core, you are forced to consider structure &#40;What is central? What is on the surface? What clusters together?&#41; – questions that lead to insight about the information itself.)

[//]: # ()
[//]: # (Another aspect of “a way of seeing” is literal: if you were to visualize Livnium Core &#40;either physically 3D printed or in a 3D software&#41;, you could *see data*. Patterns that might be hidden in a spreadsheet or code could jump out when that data is arranged spatially. For instance, a symmetrical pattern of symbols might tell you two parts of a system are in harmony. A lone symbol buried deep might indicate something important but not yet realized &#40;like a hidden assumption&#41;. In this way, Livnium becomes a lens or a mirror for complex systems – a way to **see meaning** that would otherwise be abstract.)

[//]: # ()
[//]: # (Finally, Livnium Core fosters a mindset of **wholeness**. Because it always deals with a complete 27-unit structure, it encourages holistic thinking. Even if you are focusing on one part of the core, the rest is still there, context intact. This is different from isolating parts of a problem and forgetting the whole. Livnium’s way of organizing meaning ensures you carry the whole context along as you manipulate parts of it. It’s a gentle reminder that in many systems &#40;technical, biological, social, philosophical&#41;, the whole is more than the sum of parts and the context matters.)

[//]: # ()
[//]: # (In short, Livnium Core is as much about **reshaping the thinker’s mind** as it is about reshaping symbols. It invites you to step out of the flatland of text and lists, into a realm where **thought has form and form has thought**. It’s a new way of seeing – one where understanding might literally mean turning something over in your hands &#40;or in your mind’s eye&#41; to grasp it fully.)

[//]: # ()
[//]: # (## Getting Started with the Dart Implementation)

[//]: # ()
[//]: # (Ready to explore Livnium Core hands-on? A Dart implementation of Livnium has been created to let you experiment with this spatial symbolic system in code. Here’s how you can get started and what you can do:)

[//]: # ()
[//]: # (**1\. Installation / Setup:**  )

[//]: # (The Livnium Core implementation is available as a Dart package &#40;and you can find it via its repository or Dart’s package manager&#41;. If it’s published on pub.dev, you can add it to your pubspec.yaml as a dependency. If not, you can clone the GitHub repository directly. Assuming you have the code ready, make sure you have Dart or Flutter installed on your system to run it.)

[//]: # ()
[//]: # (**2\. Understanding the Structure in Code:**  )

[//]: # (The core data structure is likely represented by a class &#40;for example, LivniumCore or simply Core&#41; which internally might use a 3D array or some indexing scheme for the 27 symbols. Upon initialization, the core might start in an “solved” or ordered state &#40;with symbols 0–26 in a default arrangement&#41;. There may be methods to query the state, such as getting the symbol at a certain position, or printing out a representation of a face or layer.)

[//]: # ()
[//]: # (**3\. Performing Rotations &#40;Operations&#41;:**  )

[//]: # (The Dart API should provide methods to perform rotations. For example, there might be a method like core.rotate&#40;face, direction&#41; where face could be one of the six faces &#40;perhaps identified by an enum or string like "front", "up", "left", etc.&#41; and direction could be clockwise or counter-clockwise &#40;maybe a boolean or another enum&#41;. If not, there might be specific methods like rotateFrontClockwise&#40;&#41; for convenience. Check the documentation or code comments for the exact usage. When you call a rotation method, the internal state of the core will update – the symbols will be moved accordingly to simulate that face turn.)

[//]: # ()
[//]: # (**4\. Computing Energy and Other Properties:**  )

[//]: # (There might be utility functions to compute the symbolic energy or other properties of the state. For instance, a method core.computeEnergyMap&#40;&#41; might return the energy value for each symbol or each position. Or simpler, there could be a function to calculate the total exposure of each symbol currently. If such functions aren’t directly provided, you can always derive it since you know the classification of positions &#40;corner, edge, etc.&#41;. Perhaps the implementation defines the positions and knows inherently which are which.)

[//]: # ()
[//]: # (**5\. Using Test Functions:**  )

[//]: # (The project includes a suite of test functions that double as examples. After installing, navigate to the project directory and run the tests with the Dart tool &#40;for example, by running dart test or using flutter test if it’s within a Flutter context&#41;. The tests will exercise the core’s functionality and you can read them to learn how to use the API. Look for test files &#40;likely under a test/ directory, e.g., core\_test.dart or similar&#41;. These tests might include scenarios like: \- Creating a new core and verifying the initial arrangement is as expected &#40;all symbols in their default spots&#41;. \- Rotating a face and asserting that the arrangement updated correctly &#40;e.g., symbol that was at a certain position moved to a new position&#41;. \- Performing a sequence of rotations and then the inverse sequence, asserting that the core returns to its original state &#40;demonstrating rotational reversibility&#41;. \- Calculating energy or checking that Om stays in the center after operations. \- Possibly encoding or decoding a configuration as a number or string, if that feature exists.)

[//]: # ()
[//]: # (For example, a simple usage &#40;hypothetical&#41; might look like:)

[//]: # ()
[//]: # (import 'package:livnium\_core/livnium\_core.dart';)

[//]: # ()
[//]: # (void main&#40;&#41; {  )

[//]: # (LivniumCore core \= LivniumCore&#40;&#41;;       // initialize the core  )

[//]: # (print&#40;core&#41;;                            // maybe prints a human-readable state  )

[//]: # (core.rotate&#40;"front", clockwise: true&#41;;  // rotate the front face 90° clockwise  )

[//]: # (core.rotate&#40;"right", clockwise: true&#41;;  // rotate the right face 90° clockwise  )

[//]: # (print&#40;core&#41;;                            // see the new state  )

[//]: # (core.rotate&#40;"right", clockwise: false&#41;; // rotate back the right face  )

[//]: # (core.rotate&#40;"front", clockwise: false&#41;; // rotate back the front face  )

[//]: # (assert&#40;core.isSolved&#41;;                  // should be back to original if implemented  )

[//]: # (})

[//]: # ()
[//]: # (The above is just illustrative – consult the actual code for exact class and method names. The key is that the test functions will guide you.)

[//]: # ()
[//]: # (**6\. Experiment and Play:**  )

[//]: # (Feel free to modify or extend the code. You could try to write a function that, say, randomizes the core by applying many random rotations, and then attempt to compute something about the random state &#40;like count how many symbols are in different layers&#41;. Or try to create your own mapping of meaning: label each symbol with a concept and see if you can simulate a transformation by rotations. The Dart implementation is there to provide a concrete sandbox for these abstract ideas, so use it creatively\!)

[//]: # ()
[//]: # (**7\. Visualization &#40;Optional&#41;:**  )

[//]: # (While not required to use Livnium, if you want to visualize the core, you might integrate with a simple graphics library or even print out ASCII representations of each face. Because the core is 3D, one textual way to see it could be printing three 3×3 grids &#40;for three faces&#41; at a time. The test functions might already output something in console for you to see. Visualization can greatly aid your understanding as you perform operations.)

[//]: # ()
[//]: # (In summary, using the Livnium Core library in Dart is straightforward: set up the library, use the provided methods to manipulate the core, and run the tests to learn the correct usage. It’s encouraged to read through the code as well – being a conceptual project, the implementation is part of the learning journey. The combination of reading the README &#40;concepts&#41; and running the code &#40;practice&#41; will give you the full picture of what Livnium Core is and how it behaves.)

[//]: # ()
[//]: # (## Future Vision: From Core to Cosmos)

[//]: # ()
[//]: # (Livnium Core is just the beginning – a seed of a much larger idea. Looking ahead, the vision is to evolve Livnium into a deeper computational symbolic framework, and perhaps even into what one might call a **metaphysical logic engine**. What could this mean? Here are a few glimpses of the possibilities:)

[//]: # ()
[//]: # (* **Expanded Dimensions:** The current core is 3×3×3. One obvious expansion is scaling the grid up – imagine a 4×4×4 or an N×N×N Livnium structure, which would increase the alphabet &#40;to N^3 symbols&#41; and allow even more complex representations. A 4×4×4 core would have 64 units, potentially a base-64 system. That would start resembling the scale of ASCII or DNA codons, opening doors to encoding larger datasets or more intricate relationships in one state. However, bigger isn’t always better; the elegance of 3×3×3 is that it’s manageable. Another form of expansion could be linking multiple 3×3×3 cores together &#40;like a network of cores&#41; to represent multi-module systems or different “contexts” interacting.)

[//]: # ()
[//]: # (* **Temporal Dynamics and Computation:** Right now, rotations are the defined operations. In the future, we could introduce **temporal logic** to Livnium – essentially turning sequences of rotations into programs. Think of each rotation as an instruction; a sequence of them as an algorithm. This could lead to a Livnium “assembly language” of sorts, where you program by specifying rotations to achieve certain end states from starting states. Because of the reversible nature, such a programming model would be invertible and possibly parallel &#40;since you could rotate different independent sections simultaneously if they don’t interfere&#41;. The framework might evolve tools to find optimal rotation sequences to go from one configuration to another &#40;a kind of path-finding in state space&#41;, which has echoes in puzzle solving algorithms but here would be purposed for meaningful computation &#40;e.g., solving a problem encoded in the start state to reach a goal state that reveals the answer&#41;.)

[//]: # ()
[//]: # (* **Higher-Level Symbolic Framework:** On top of the raw spatial model, a higher abstraction could be built. For example, we might define logical propositions or equations mapped onto Livnium configurations. The spatial arrangement could enforce constraints &#40;like certain symbols must be on opposite sides to mean a statement is true, etc.&#41;. One could envision a **Livnium theorem prover** or solver, where the rules of inference are implemented as rotations and the consistency of a set of statements is represented by a solved &#40;or unsolved&#41; state. This hints at Livnium becoming a **logic engine** – not just storing data, but performing inference or calculation in a way that blends numeric, spatial, and symbolic processing.)

[//]: # ()
[//]: # (* **Metaphysical Engine:** The term might sound grandiose, but it captures the aspiration to integrate not just formal logic but also *meaning and context* into computation. With concepts like the observer &#40;Om&#41; built into the core, Livnium has the unique potential to model scenarios that include the point-of-view or context as part of the data. A future Livnium-based engine might allow users to encode philosophical or metaphysical scenarios – for instance, modeling the relationships between consciousness, matter, and information in a spatial logic form – and then explore transformations of those models. This could provide a sandbox for testing out ideas that are usually confined to prose or thought experiments, by giving them a formal structure to play with. For example, imagine encoding different philosophical worldviews as different configurations of the core, and rotations that transition between them in a structured way, revealing commonalities and differences.)

[//]: # ()
[//]: # (* **Educational and Conceptual Tool:** We foresee Livnium evolving into a tool for learning and creativity. Its tangible nature makes it a great educational model for teaching concepts of binary vs higher-radix systems, group theory &#40;through rotations&#41;, and even philosophy &#40;through the symbolism of Om and spatial relations&#41;. Future enhancements may include interactive 3D visualizations, a library of example configurations that correspond to famous puzzles or logical problems, and perhaps an AI helper that can propose rotation sequences to achieve certain configuration goals &#40;mixing AI search with Livnium’s state space&#41;.)

[//]: # ()
[//]: # (* **Community and Collaboration:** Just as languages and frameworks grow with communities, Livnium’s future could be shaped by those who use it. We imagine a community exchanging intriguing configurations &#40;“patterns”&#41; and sequences &#40;“algorithms”&#41; as if they were sharing programs or artworks. One person might find a particularly beautiful arrangement that encodes a piece of music or a mathematical formula in the positions of symbols. Another might create a game or storytelling method using Livnium cores &#40;for example, using rotations as moves in a narrative or game&#41;. The framework can expand to accommodate these creative uses – perhaps through plugins or customized sets of symbols for specific domains.)

[//]: # ()
[//]: # (Ultimately, the vision for Livnium is **to bridge the gap between the logical and the intuitive, the computational and the conceptual**. In a world where computing and AI are increasingly powerful, Livnium offers a chance to root some of that power in a structure that is human-interpretable and philosophically rich. It’s a system where each part is meaningful on its own and as part of the whole, where operations mirror thought processes, and where an observer is always in the loop.)

[//]: # ()
[//]: # (As Livnium grows, it may well become not just an experiment in computation, but a framework for **exploring ideas themselves** – a kind of *metaphysical playground* for the analytically minded. We invite you to join in this exploration, to play with the core, to contribute your insights, and to help shape what Livnium Core can become. Today it’s a 3×3×3 grid with an Om at the center. Tomorrow, who knows – it could be a key to understanding the very structure of meaning and logic in the universe.)

[//]: # ()
[//]: # (---)

[//]: # ()
[//]: # (*Thank you for reading this far\!* We hope this README gave you a comprehensive look at Livnium Core – its origins, design, usage, and aspirations. Livnium is an ongoing journey, and every rotation is a step further. Now, go ahead and take it for a spin &#40;literally&#41;\! May you find new ways to see meaning in the structure it provides. Happy exploring with Livnium Core\!)

[//]: # ()
[//]: # (---)

[//]: # ()


Here’s a clean, drop-in **README.md** for your repo.

---

# Livnium Core — Base-27 Rotational Logic

A compact toolkit that treats information as **27-symbol words** mapped onto a **3×3×3 cube**. It gives you:

* A **bijective base-27 alphabet** (`0, a..z`) with loss-free codecs.
* A simple **energy grammar** for cube pieces (face/edge/corner) with the equilibrium constant **K = 10.125**.
* **Rotations & face moves** with invariants (counts + energy stay constant).
* **Potts(27)** memory units for geometry-aware associative recall.
* **Couplers (“tunnels”)** to weight interactions by exposure and distance.
* **Hierarchical micro-cubes** (27 per node) for building trees of meaning.

---

## Install

Add the package to your Dart/Flutter project (path or git), then:

```dart
import 'package:livnium_core/livnium_core.dart';
```

> Some advanced APIs are currently under `src/` (e.g., arithmetic and kernels). Those are marked below as **experimental**.

---

## Quick start

### 1) Alphabet & Codecs (no ambiguity)

```dart
import 'package:livnium_core/livnium_core.dart';

void main() {
  // Alphabet
  print(stringToDigits('love'));     // [12,15,22,5]
  print(digitsToString([1,0,26]));   // "a0z"
  print(isValidWord('0az'));         // true

  // Codecs
  final csv   = encodeCsv('a0')!;    // "1,0"
  final fixed = encodeFixed('a0')!;  // "0100"
  final big   = encodeBigIntTail('a0')!; // tail-sentinel BigInt
  print([csv, fixed, big]);          // [1,0, 0100, 731]

  // Round-trips
  assert(decodeCsv(csv) == 'a0');
  assert(decodeFixed(fixed) == 'a0');
  assert(decodeBigIntTail(big) == 'a0');
}
```

---

### 2) Energy grammar (two scales)

```dart
import 'package:livnium_core/livnium_core.dart';

void main() {
  // Equilibrium constant (from 27/8 + 27/12 + 27/6)
  print(equilibriumConstant); // 10.125

  // Per-face unit (K/f)
  print(perFaceUnitEnergy(1)); // 10.125
  print(perFaceUnitEnergy(2)); //  5.0625
  print(perFaceUnitEnergy(3)); //  3.375

  // 9/18/27 scale
  print(symbolEnergy9('a')); // 9 (center)
  print(symbolEnergy9('g')); // 18 (edge)
  print(symbolEnergy9('s')); // 27 (corner)
  print(wordEnergy9('liv')); // 63

  // K-scale (1K, 2K, 3K)
  print(symbolEnergyK('a')); // 10.125
  print(symbolEnergyK('g')); // 20.25
  print(symbolEnergyK('s')); // 30.375
  print(wordEnergyK('liv')); // 70.875
}
```

---

### 3) Rotations & Moves (invariants hold)

```dart
import 'package:livnium_core/livnium_core.dart';

void main() {
  // Rotate a coordinate
  const v = Vec3(1, 1, -1);
  final rz = rotateZ(v);             // (-1, 1, -1)
  assert(rz == const Vec3(-1, 1, -1));

  // Face moves (U,D,L,R,F,B), quarterTurns in ±1..±3
  final symbols = List<int>.generate(27, (i) => i); // toy payload
  final seq = [FaceMove(Face.U, 1), FaceMove(Face.R, 1), FaceMove(Face.F, -1)];
  applyMoves(symbols, seq);

  // Energy & counts invariants (sketch)
  double energy(List<int> s) =>
      s.map((d) => symbolEnergy9(valueToSymbol(d)!)!).reduce((a,b)=>a+b);
  // Compare before/after in your code — they’re equal.
}
```

---

### 4) Couplers (“tunnels”) & interference

```dart
import 'package:livnium_core/livnium_core.dart';

void main() {
  final p = CouplerParams(tau0: 1.0, alpha: 1.0);
  final top = rankTopCouplers(p, 5);
  for (final t in top) {
    print('pos=${t.pos}  L=${t.L}  faces=${t.faces}  C=${t.C.toStringAsFixed(4)}');
  }

  // Two-source phasor sum
  if (top.length >= 2) {
    final c1 = top[0].C, c2 = top[1].C;
    final mag = complexSumMagnitude([(c1, 0.0), (c2, 180.0)]);
    print('|sum| at 180° = $mag'); // destructive interference
  }
}
```

Coupler formula:

$$
C(\mathbf{v})=\tau_0 \cdot \frac{K}{\text{faces}(\mathbf{v})}\cdot \frac{1}{\text{L}_1(\mathbf{v})^{\,\alpha}}
$$

where `faces∈{1,2,3}`, `L1∈{1,2,3}`, `K=10.125`.

---

### 5) Geometry-aware memory: Potts(27)

```dart
import 'package:livnium_core/livnium_core.dart';

void main() {
  // Build a 27-node (3×3×3) Potts network
  final net = Potts27.cube();

  // Store some patterns
  List<int> patternForWord(String w) =>
      List<int>.generate(27, (i) => stringToDigits(w)![i % w.length]);

  final patterns = ['love','grace','unity'].map(patternForWord).toList();
  net.store(patterns, scale: 1.0, targetNorm: 0.5, blend: 1.0);

  // Start from a noisy version, then relax
  final target = patterns.first;
  final noisy = List<int>.from(target)..[0] = (target[0] + 1) % 27;
  for (var i = 0; i < net.n; i++) net.s[i] = noisy[i];
  net.relax();

  // Count recovered symbols
  var correct = 0;
  for (var i = 0; i < target.length; i++) {
    if (net.s[i] == target[i]) correct++;
  }
  print('Recovered $correct / 27');
}
```

> Advanced: build coupler-weighted connections with a similarity kernel (e.g., `cosKernel`) — available under `src/potts.dart`.

---

### 6) Hierarchical micro-cubes (27 per node)

```dart
import 'package:livnium_core/livnium_core.dart';

void main() {
  final tree = LivniumTree(energyPerNode: 10.125);
  final root = CubePath.parse('');
  final slotS = symbolToValue('s')!;

  // Seed root with a pattern
  final ds = stringToDigits('unity')!;
  for (var i = 0; i < 27; i++) tree.setSymbol(root, i, ds[i % ds.length]);

  // Child under 's' gets a sharper sub-pattern
  final child = CubePath.parse('s');
  final sub = stringToDigits('love')!;
  for (var i = 0; i < 27; i++) tree.setSymbol(child, i, sub[i % sub.length]);

  // Evolve a couple of rounds (pull children → parent, local settle, push bias)
  tree.evolve(maxDepth: 2, biasStrength: 0.2, localIters: 10);
  tree.evolve(maxDepth: 2, biasStrength: 0.2, localIters: 10);

  print('Root slot "s" now = ${valueToSymbol(tree.getSymbol(root, slotS))}');
}
```

---

### 7) Projections & coarse graining

```dart
import 'package:livnium_core/livnium_core.dart';

void main() {
  final byL1 = <int, int>{};
  for (final v in cube3Coords()) {
    byL1[l1(v)] = (byL1[l1(v)] ?? 0) + 1;
  }
  print(byL1); // {0:1, 1:6, 2:12, 3:8}

  final buckets = radialBins();      // map L1→points
  final yz = dropAxis('x');          // 2D slices
  print([buckets.length, yz.length]);
}
```

---

### (Experimental) Base-27 arithmetic

> **API:** under `package:livnium_core/src/arith27.dart`

```dart
import 'package:livnium_core/src/arith27.dart';

void main() {
  print(toDecimal('a0'));                 // 27 as BigInt
  print(fromDecimal(BigInt.from(27)));    // "a0"

  print(add27('z','a'));                  // "a0"
  print(add27Balanced('liv','nium'));     // equal to BigInt sum, fewer carry ripples
}
```

---

## Examples & tests

Run any example:

```bash
dart run example/encode_demo.dart
dart run example/energy_demo.dart
dart run example/moves_demo.dart
dart run example/coupler_demo.dart
dart run example/recall_demo.dart
dart run example/hierarchy_demo.dart
dart run example/arith_carry_demo.dart
dart run example/projection_demo.dart
```

Run the test suite:

```bash
dart test
```

---

## Core concepts (one-liners)

* **Alphabet:** 27 symbols with bijective mapping; **no dependency on decimal**.
* **Codecs:** CSV (human), Fixed 00–26 (fixed-width), Tail-sentinel BigInt (loss-free), Raw base-27 (math).
* **K = 10.125:** $27/8 + 27/12 + 27/6$ — the cube’s harmonic constant.
* **Energy scales:** `SE9` (9/18/27) and `SEK` (1K/2K/3K).
* **Invariants:** Face moves preserve class counts (1 core, 6 centers, 12 edges, 8 corners) and total energy.
* **Couplers:** $C(v)=\tau_0\cdot K/\text{faces}/\text{L}_1^\alpha$, enabling interference demos.
* **Potts(27):** geometry-aware distributed memory; supports Hebbian store, relax dynamics.
* **Hierarchy:** Each node is a 27-slot micro-cube; parent/child pooling + bias for top-down/bottom-up flow.

---

## Status & roadmap

* ✅ Alphabet, codecs, energy grammar, rotations/moves, couplers, Potts(27), hierarchy, projections.
* 🔬 Experimental: base-27 arithmetic (`add27Balanced`), kernel export surface.
* Next: richer move sequences & benchmarks, docs on kernels, more visual demos.

---

## License

© 2025 Chetan Patil — Licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
---

## Acknowledgements

Built from the idea that **“reality is rotation”**: a cube’s structure and a base-27 language can co-define clean computation and memory.
