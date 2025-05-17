import {
  User,
  InsertUser,
  Connection,
  InsertConnection,
  ForumCategory,
  InsertForumCategory,
  ForumPost,
  InsertForumPost,
  ForumComment,
  InsertForumComment,
  CourseCategory,
  InsertCourseCategory,
  Course,
  InsertCourse,
  ProfessionalSpecialty,
  InsertProfessionalSpecialty,
  Professional,
  InsertProfessional,
  ClinicalCategory,
  InsertClinicalCategory,
  ClinicalCondition,
  InsertClinicalCondition,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  getNearbyUsers(userId: number, maxDistance: number): Promise<User[]>;
  
  // Connection methods
  getConnection(userId: number, targetUserId: number): Promise<Connection | undefined>;
  createConnection(connection: InsertConnection): Promise<Connection>;
  getUserMatches(userId: number): Promise<User[]>;
  
  // Forum methods
  getForumCategories(): Promise<ForumCategory[]>;
  createForumCategory(category: InsertForumCategory): Promise<ForumCategory>;
  getForumPosts(categoryId?: number): Promise<ForumPost[]>;
  getForumPostsByPopularity(): Promise<ForumPost[]>;
  getForumPostById(id: number): Promise<ForumPost | undefined>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getForumComments(postId: number): Promise<ForumComment[]>;
  createForumComment(comment: InsertForumComment): Promise<ForumComment>;
  voteOnPost(postId: number, userId: number, isUpvote: boolean): Promise<ForumPost>;
  
  // Course methods
  getCourseCategories(): Promise<CourseCategory[]>;
  createCourseCategory(category: InsertCourseCategory): Promise<CourseCategory>;
  getCourses(categoryId?: number): Promise<Course[]>;
  getFeaturedCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Professional methods
  getProfessionalSpecialties(): Promise<ProfessionalSpecialty[]>;
  createProfessionalSpecialty(specialty: InsertProfessionalSpecialty): Promise<ProfessionalSpecialty>;
  getProfessionals(specialtyId?: number, location?: { lat: number, lng: number, radius: number }): Promise<Professional[]>;
  getProfessionalById(id: number): Promise<Professional | undefined>;
  createProfessional(professional: InsertProfessional): Promise<Professional>;
  
  // Clinical conditions methods
  getClinicalCategories(): Promise<ClinicalCategory[]>;
  getClinicalCategory(id: number): Promise<ClinicalCategory | undefined>;
  createClinicalCategory(category: InsertClinicalCategory): Promise<ClinicalCategory>;
  getClinicalConditions(categoryId?: number): Promise<ClinicalCondition[]>;
  getClinicalConditionById(id: number): Promise<ClinicalCondition | undefined>;
  createClinicalCondition(condition: InsertClinicalCondition): Promise<ClinicalCondition>;
}

export class MemStorage implements IStorage {
  // Implementazione metodi per le condizioni cliniche
  async getClinicalCategories(): Promise<ClinicalCategory[]> {
    return Array.from(this.clinicalCategories.values());
  }

  async getClinicalCategory(id: number): Promise<ClinicalCategory | undefined> {
    return this.clinicalCategories.get(id);
  }

  async createClinicalCategory(category: InsertClinicalCategory): Promise<ClinicalCategory> {
    const id = this.clinicalCategoryIdCounter++;
    const newCategory: ClinicalCategory = { ...category, id };
    this.clinicalCategories.set(id, newCategory);
    return newCategory;
  }

  async getClinicalConditions(categoryId?: number): Promise<ClinicalCondition[]> {
    if (categoryId) {
      return Array.from(this.clinicalConditions.values())
        .filter(condition => condition.categoryId === categoryId);
    }
    return Array.from(this.clinicalConditions.values());
  }

  async getClinicalConditionById(id: number): Promise<ClinicalCondition | undefined> {
    return this.clinicalConditions.get(id);
  }

  async createClinicalCondition(condition: InsertClinicalCondition): Promise<ClinicalCondition> {
    const id = this.clinicalConditionIdCounter++;
    const newCondition: ClinicalCondition = { ...condition, id };
    this.clinicalConditions.set(id, newCondition);
    return newCondition;
  }

  private initializeClinicalData() {
    // Categorie di condizioni cliniche
    const reproductive = this.createClinicalCategory({
      name: "Salute riproduttiva",
      description: "Condizioni legate al sistema riproduttivo femminile"
    });

    const pregnancy = this.createClinicalCategory({
      name: "Gravidanza",
      description: "Condizioni e cambiamenti durante la gravidanza"
    });

    const menopause = this.createClinicalCategory({
      name: "Menopausa",
      description: "Condizioni legate alla menopausa e perimenopausa"
    });

    const breast = this.createClinicalCategory({
      name: "Seno",
      description: "Condizioni del seno e relativi sintomi"
    });

    // Condizioni cliniche con immagini
    this.createClinicalCondition({
      name: "Endometriosi",
      description: "L'endometriosi è una condizione in cui il tessuto che normalmente riveste l'interno dell'utero (l'endometrio) cresce all'esterno dell'utero, tipicamente sulle ovaie, sulle tube di Falloppio e sul tessuto che riveste il bacino.",
      symptoms: "Dolore pelvico, dolore durante il ciclo mestruale, dolore durante i rapporti, sanguinamento anomalo, problemi di fertilità",
      categoryId: reproductive.id,
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZW5kb21ldHJpb3Npc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
      treatmentInfo: "Trattamenti ormonali, chirurgia, gestione del dolore",
      severity: "medium",
      commonness: "common"
    });

    this.createClinicalCondition({
      name: "Sindrome dell'ovaio policistico (PCOS)",
      description: "La PCOS è una condizione ormonale comune che colpisce le donne in età riproduttiva, caratterizzata da livelli elevati di androgeni, cisti ovariche e irregolarità mestruali.",
      symptoms: "Irregolarità mestruali, acne, crescita eccessiva di peli, aumento di peso, difficoltà a concepire",
      categoryId: reproductive.id,
      image: "https://images.unsplash.com/photo-1618615304438-db01b0a96573?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cG9seWN5c3RpYyUyMG92YXJ5JTIwc3luZHJvbWV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
      treatmentInfo: "Cambiamenti nello stile di vita, farmaci ormonali, gestione dei sintomi",
      severity: "medium",
      commonness: "common"
    });

    this.createClinicalCondition({
      name: "Fibromi uterini",
      description: "I fibromi uterini sono tumori benigni non cancerosi che crescono nell'utero o sulla parete uterina.",
      symptoms: "Mestruazioni abbondanti, dolore pelvico, pressione, frequente necessità di urinare",
      categoryId: reproductive.id,
      image: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      treatmentInfo: "Farmaci, procedure minimamente invasive, intervento chirurgico",
      severity: "medium",
      commonness: "common"
    });

    this.createClinicalCondition({
      name: "Diabete gestazionale",
      description: "Il diabete gestazionale è un tipo di diabete che si sviluppa durante la gravidanza in donne che non avevano il diabete prima.",
      symptoms: "Spesso asintomatico, ma può causare sete eccessiva, minzione frequente e stanchezza",
      categoryId: pregnancy.id,
      image: "https://images.unsplash.com/photo-1579165466991-467135ad3110?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      treatmentInfo: "Dieta, esercizio fisico, monitoraggio della glicemia, insulina se necessario",
      severity: "medium",
      commonness: "occasional"
    });

    this.createClinicalCondition({
      name: "Preeclampsia",
      description: "La preeclampsia è una complicazione della gravidanza caratterizzata da pressione alta e segni di danno ad altri organi, spesso al fegato e ai reni.",
      symptoms: "Pressione alta, proteine nelle urine, gonfiore, mal di testa, visione offuscata",
      categoryId: pregnancy.id,
      image: "https://images.unsplash.com/photo-1547489432-75c3789fe783?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      treatmentInfo: "Monitoraggio, parto anticipato se necessario, farmaci per la pressione",
      severity: "high",
      commonness: "occasional"
    });

    this.createClinicalCondition({
      name: "Vampate di calore",
      description: "Le vampate di calore sono un sintomo comune della menopausa, caratterizzate da una sensazione improvvisa di calore intenso nella parte superiore del corpo.",
      symptoms: "Sensazione improvvisa di calore, rossore al viso e collo, sudorazione, battito cardiaco accelerato",
      categoryId: menopause.id,
      image: "https://images.unsplash.com/photo-1584286574620-3cb49d0b18d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      treatmentInfo: "Terapia ormonale sostitutiva, cambiamenti nello stile di vita, farmaci non ormonali",
      severity: "low",
      commonness: "common"
    });

    this.createClinicalCondition({
      name: "Mastite",
      description: "La mastite è un'infiammazione del tessuto mammario che a volte coinvolge un'infezione. La condizione può verificarsi durante l'allattamento.",
      symptoms: "Dolore, gonfiore, arrossamento, calore nel seno, febbre, sensazione di malessere",
      categoryId: breast.id,
      image: "https://images.unsplash.com/photo-1579165466676-349b282fb3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      treatmentInfo: "Antibiotici, antidolorifici, continuare ad allattare o estrarre il latte",
      severity: "medium",
      commonness: "occasional"
    });
  }
  private users: Map<number, User>;
  private connections: Map<number, Connection>;
  private forumCategories: Map<number, ForumCategory>;
  private forumPosts: Map<number, ForumPost>;
  private forumComments: Map<number, ForumComment>;
  private courseCategories: Map<number, CourseCategory>;
  private courses: Map<number, Course>;
  private professionalSpecialties: Map<number, ProfessionalSpecialty>;
  private professionals: Map<number, Professional>;
  private clinicalCategories: Map<number, ClinicalCategory>;
  private clinicalConditions: Map<number, ClinicalCondition>;
  
  private userIdCounter: number;
  private connectionIdCounter: number;
  private forumCategoryIdCounter: number;
  private forumPostIdCounter: number;
  private forumCommentIdCounter: number;
  private courseCategoryIdCounter: number;
  private courseIdCounter: number;
  private professionalSpecialtyIdCounter: number;
  private professionalIdCounter: number;
  private clinicalCategoryIdCounter: number;
  private clinicalConditionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.connections = new Map();
    this.forumCategories = new Map();
    this.forumPosts = new Map();
    this.forumComments = new Map();
    this.courseCategories = new Map();
    this.courses = new Map();
    this.professionalSpecialties = new Map();
    this.professionals = new Map();
    this.clinicalCategories = new Map();
    this.clinicalConditions = new Map();
    
    this.userIdCounter = 1;
    this.connectionIdCounter = 1;
    this.forumCategoryIdCounter = 1;
    this.forumPostIdCounter = 1;
    this.forumCommentIdCounter = 1;
    this.courseCategoryIdCounter = 1;
    this.courseIdCounter = 1;
    this.professionalSpecialtyIdCounter = 1;
    this.professionalIdCounter = 1;
    this.clinicalCategoryIdCounter = 1;
    this.clinicalConditionIdCounter = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample data
    this.initializeClinicalData();
    // Forum categories
    const pregnancy = this.createForumCategory({
      name: "Gravidanza",
      description: "Discussioni sulla gravidanza",
      icon: "baby-carriage",
    });
    
    const menopause = this.createForumCategory({
      name: "Menopausa",
      description: "Discussioni sulla menopausa",
      icon: "temperature-high",
    });
    
    const generalHealth = this.createForumCategory({
      name: "Salute generale",
      description: "Discussioni sulla salute generale femminile",
      icon: "heartbeat",
    });
    
    // Course categories
    const prenatal = this.createCourseCategory({
      name: "Pre parto",
      description: "Corsi per la preparazione al parto",
    });
    
    const postpartum = this.createCourseCategory({
      name: "Postpartum",
      description: "Corsi per il periodo post parto",
    });
    
    const menopauseCourses = this.createCourseCategory({
      name: "Menopausa",
      description: "Corsi sulla gestione della menopausa",
    });
    
    const fertility = this.createCourseCategory({
      name: "Fertilità",
      description: "Corsi sulla fertilità",
    });
    
    const generalWellbeing = this.createCourseCategory({
      name: "Benessere generale",
      description: "Corsi sul benessere generale",
    });
    
    // Courses
    this.createCourse({
      title: "Preparazione completa al parto naturale",
      description: "Guida completa alla preparazione per un parto naturale",
      categoryId: prenatal.id,
      duration: "8 settimane",
      price: 12900,
      image: "https://pixabay.com/get/ge85101de140b68975066c855035c206ba18ad118662b38f40990a5750d34bcf47886d31c2a51d9e56235dde96e6eb7db1ceae05d4427587fbc52347979a5c20c_1280.jpg",
      featured: true,
      rating: 4.8,
      ratingCount: 124,
    });
    
    this.createCourse({
      title: "Yoga prenatale per ogni trimestre",
      description: "Esercizi e pose adatte ad ogni fase della gravidanza",
      categoryId: prenatal.id,
      duration: "6 settimane",
      price: 8900,
      image: "https://pixabay.com/get/g85d995ab909ccf3ca6f4e2a833f8b2dd591f3c5bc881594097d26c1d38613b279fb6afa9dd777fd6cdb5cb9e1bce0fc46c208b691a32031c95223b8d7214f0fb_1280.jpg",
      featured: false,
      rating: 4.5,
      ratingCount: 92,
    });
    
    this.createCourse({
      title: "Vivere bene la menopausa",
      description: "Strategie alimentari e di stile di vita per la transizione",
      categoryId: menopauseCourses.id,
      duration: "4 settimane",
      price: 7500,
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      featured: false,
      rating: 4.0,
      ratingCount: 68,
    });
    
    this.createCourse({
      title: "Primi 3 mesi con il tuo bambino",
      description: "Guida completa alla cura del neonato e al recupero post-parto",
      categoryId: postpartum.id,
      duration: "8 settimane",
      price: 9900,
      image: "https://pixabay.com/get/g52577d2cc549e402e6855ae6ee164ef00a4bcb1ded1a85090369ba9e57aa05cf2b8d8d99784fd1a612535fdc775c5bca98cff84db891563cd754fbded2e5b10a_1280.jpg",
      featured: false,
      rating: 4.9,
      ratingCount: 156,
    });
    
    // Professional specialties
    const gynecologist = this.createProfessionalSpecialty({
      name: "Ginecologo",
    });
    
    const midwife = this.createProfessionalSpecialty({
      name: "Ostetrica",
    });
    
    const endocrinologist = this.createProfessionalSpecialty({
      name: "Endocrinologo",
    });
    
    const psychologist = this.createProfessionalSpecialty({
      name: "Psicologo perinatale",
    });
    
    const physiotherapist = this.createProfessionalSpecialty({
      name: "Fisioterapista pelvico",
    });
    
    // Professionals
    this.createProfessional({
      name: "Dott.ssa Marina Bianchi",
      specialtyId: gynecologist.id,
      bio: "15+ anni di esperienza. Ha seguito oltre 1000 gravidanze e si occupa di salute della donna in tutte le fasi della vita.",
      address: "Via Garibaldi 45, Milano",
      latitude: 45.4642,
      longitude: 9.1900,
      avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      experience: "15+ anni",
      languages: ["Italiano", "Inglese", "Francese"],
      specializations: ["Gravidanza ad alto rischio", "Fertilità", "Menopausa"],
      rating: 4.5,
      ratingCount: 128,
    });
    
    this.createProfessional({
      name: "Francesca Rossi",
      specialtyId: midwife.id,
      bio: "10 anni di esperienza in assistenza al parto naturale. Conduce corsi pre-parto e offre supporto nel postpartum.",
      address: "Corso Venezia 12, Milano",
      latitude: 45.4706,
      longitude: 9.1982,
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      experience: "10 anni",
      languages: ["Italiano", "Inglese"],
      specializations: ["Preparazione al parto", "Assistenza domiciliare", "Allattamento"],
      rating: 5.0,
      ratingCount: 97,
    });
    
    // Users
    const user1 = this.createUser({
      username: "alessia32",
      password: "password123", // in a real app, this would be hashed
      name: "Alessia",
      age: 32,
      bio: "Sono al secondo trimestre e cerco altre mamme per condividere l'esperienza.",
      interests: ["Gravidanza", "Yoga"],
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
      latitude: 45.4642,
      longitude: 9.1900,
    });
    
    const user2 = this.createUser({
      username: "marina_mom",
      password: "password123",
      name: "Marina",
      age: 28,
      bio: "Neo mamma alla ricerca di consigli e supporto.",
      interests: ["Postpartum", "Allattamento"],
      avatar: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      latitude: 45.4706,
      longitude: 9.1982,
    });
    
    const user3 = this.createUser({
      username: "giulia_45",
      password: "password123",
      name: "Giulia",
      age: 45,
      bio: "Navigando la menopausa e cercando di mantenermi attiva.",
      interests: ["Menopausa", "Fitness"],
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      latitude: 45.4668,
      longitude: 9.1905,
    });
    
    const user4 = this.createUser({
      username: "amara_wellness",
      password: "password123",
      name: "Amara",
      age: 30,
      bio: "Esperta di wellness, incinta del primo figlio.",
      interests: ["Gravidanza", "Nutrizione"],
      avatar: "https://images.unsplash.com/photo-1611432579699-484f7990b127?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      latitude: 45.4720,
      longitude: 9.1850,
    });
    
    const user5 = this.createUser({
      username: "sofia_mom",
      password: "password123",
      name: "Sofia",
      age: 34,
      bio: "Mamma di due bambini, attualmente in fase postpartum.",
      interests: ["Postpartum", "Sonno neonati"],
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      latitude: 45.4700,
      longitude: 9.1930,
    });
    
    // Create some connections
    this.createConnection({
      userId: user1.id,
      targetUserId: user2.id,
      status: "matched",
    });
    
    this.createConnection({
      userId: user1.id,
      targetUserId: user4.id,
      status: "matched",
    });
    
    // Forum posts
    this.createForumPost({
      title: "Qual è la vostra esperienza con il parto naturale vs. cesareo?",
      content: "Sono alla 30ma settimana e sto valutando le opzioni. Vorrei tanto sapere le vostre esperienze personali, pro e contro, e come vi siete preparate.",
      userId: user1.id,
      categoryId: pregnancy.id,
      upvotes: 128,
      downvotes: 0,
    });
    
    this.createForumPost({
      title: "Rimedi naturali che hanno funzionato per le vampate di calore",
      content: "Dopo tanto sperimentare, ho trovato alcune tecniche che mi hanno davvero aiutato con le vampate senza ricorrere a farmaci. Vi condivido la mia esperienza e vorrei sapere cosa ha funzionato per voi.",
      userId: user3.id,
      categoryId: menopause.id,
      upvotes: 86,
      downvotes: 0,
    });
    
    this.createForumPost({
      title: "[AMA] Sono un ginecologo con 20 anni di esperienza. Chiedetemi quello che volete!",
      content: "Ciao a tutte! Sono qui per rispondere alle vostre domande su ciclo mestruale, contraccezione, salute riproduttiva e qualsiasi altro dubbio abbiate. Nessuna domanda è troppo imbarazzante.",
      userId: user2.id,
      categoryId: generalHealth.id,
      upvotes: 214,
      downvotes: 0,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getNearbyUsers(userId: number, maxDistance: number): Promise<User[]> {
    const user = this.users.get(userId);
    if (!user || !user.latitude || !user.longitude) return [];

    // Get all connections for this user
    const userConnections = Array.from(this.connections.values())
      .filter(conn => conn.userId === userId)
      .map(conn => conn.targetUserId);

    // Filter users who are nearby and not already connected
    return Array.from(this.users.values())
      .filter(otherUser => {
        if (otherUser.id === userId) return false;
        if (userConnections.includes(otherUser.id)) return false;
        if (!otherUser.latitude || !otherUser.longitude) return false;

        // Calculate distance (simplified for demo)
        const distance = this.calculateDistance(
          user.latitude,
          user.longitude,
          otherUser.latitude,
          otherUser.longitude
        );

        return distance <= maxDistance;
      });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Simple distance calculation (in km) - Haversine formula
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  }

  // Connection methods
  async getConnection(userId: number, targetUserId: number): Promise<Connection | undefined> {
    return Array.from(this.connections.values()).find(
      conn => conn.userId === userId && conn.targetUserId === targetUserId
    );
  }

  async createConnection(connection: InsertConnection): Promise<Connection> {
    const id = this.connectionIdCounter++;
    const now = new Date();
    const newConnection: Connection = { 
      ...connection, 
      id, 
      createdAt: now 
    };
    this.connections.set(id, newConnection);
    
    // If both users liked each other, update both connections to "matched"
    const reverseConnection = Array.from(this.connections.values()).find(
      conn => conn.userId === connection.targetUserId && conn.targetUserId === connection.userId
    );
    
    if (reverseConnection && connection.status === "liked" && reverseConnection.status === "liked") {
      newConnection.status = "matched";
      reverseConnection.status = "matched";
      this.connections.set(reverseConnection.id, reverseConnection);
    }
    
    return newConnection;
  }

  async getUserMatches(userId: number): Promise<User[]> {
    // Get all connections where this user has a match
    const matchConnections = Array.from(this.connections.values())
      .filter(conn => conn.userId === userId && conn.status === "matched")
      .map(conn => conn.targetUserId);
    
    // Get user details for each match
    return matchConnections
      .map(id => this.users.get(id))
      .filter((user): user is User => user !== undefined);
  }

  // Forum methods
  async getForumCategories(): Promise<ForumCategory[]> {
    return Array.from(this.forumCategories.values());
  }

  async createForumCategory(category: InsertForumCategory): Promise<ForumCategory> {
    const id = this.forumCategoryIdCounter++;
    const newCategory: ForumCategory = { ...category, id };
    this.forumCategories.set(id, newCategory);
    return newCategory;
  }

  async getForumPosts(categoryId?: number): Promise<ForumPost[]> {
    let posts = Array.from(this.forumPosts.values());
    
    if (categoryId) {
      posts = posts.filter(post => post.categoryId === categoryId);
    }
    
    // Sort by most recent
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getForumPostsByPopularity(): Promise<ForumPost[]> {
    // Sort by upvotes - downvotes (score)
    return Array.from(this.forumPosts.values())
      .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
  }

  async getForumPostById(id: number): Promise<ForumPost | undefined> {
    return this.forumPosts.get(id);
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const id = this.forumPostIdCounter++;
    const now = new Date();
    const newPost: ForumPost = { 
      ...post, 
      id, 
      upvotes: 0, 
      downvotes: 0, 
      createdAt: now 
    };
    this.forumPosts.set(id, newPost);
    return newPost;
  }

  async getForumComments(postId: number): Promise<ForumComment[]> {
    return Array.from(this.forumComments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createForumComment(comment: InsertForumComment): Promise<ForumComment> {
    const id = this.forumCommentIdCounter++;
    const now = new Date();
    const newComment: ForumComment = { 
      ...comment, 
      id, 
      upvotes: 0, 
      downvotes: 0, 
      createdAt: now 
    };
    this.forumComments.set(id, newComment);
    return newComment;
  }

  async voteOnPost(postId: number, userId: number, isUpvote: boolean): Promise<ForumPost> {
    const post = this.forumPosts.get(postId);
    if (!post) throw new Error("Post not found");
    
    if (isUpvote) {
      post.upvotes += 1;
    } else {
      post.downvotes += 1;
    }
    
    this.forumPosts.set(postId, post);
    return post;
  }

  // Course methods
  async getCourseCategories(): Promise<CourseCategory[]> {
    return Array.from(this.courseCategories.values());
  }

  async createCourseCategory(category: InsertCourseCategory): Promise<CourseCategory> {
    const id = this.courseCategoryIdCounter++;
    const newCategory: CourseCategory = { ...category, id };
    this.courseCategories.set(id, newCategory);
    return newCategory;
  }

  async getCourses(categoryId?: number): Promise<Course[]> {
    let courses = Array.from(this.courses.values());
    
    if (categoryId) {
      courses = courses.filter(course => course.categoryId === categoryId);
    }
    
    return courses;
  }

  async getFeaturedCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.featured);
  }

  async getCourseById(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.courseIdCounter++;
    const newCourse: Course = { ...course, id, rating: 0, ratingCount: 0 };
    this.courses.set(id, newCourse);
    return newCourse;
  }

  // Professional methods
  async getProfessionalSpecialties(): Promise<ProfessionalSpecialty[]> {
    return Array.from(this.professionalSpecialties.values());
  }

  async createProfessionalSpecialty(specialty: InsertProfessionalSpecialty): Promise<ProfessionalSpecialty> {
    const id = this.professionalSpecialtyIdCounter++;
    const newSpecialty: ProfessionalSpecialty = { ...specialty, id };
    this.professionalSpecialties.set(id, newSpecialty);
    return newSpecialty;
  }

  async getProfessionals(specialtyId?: number, location?: { lat: number, lng: number, radius: number }): Promise<Professional[]> {
    let professionals = Array.from(this.professionals.values());
    
    if (specialtyId) {
      professionals = professionals.filter(pro => pro.specialtyId === specialtyId);
    }
    
    if (location && location.lat && location.lng && location.radius) {
      professionals = professionals.filter(pro => {
        if (!pro.latitude || !pro.longitude) return false;
        
        const distance = this.calculateDistance(
          location.lat,
          location.lng,
          pro.latitude,
          pro.longitude
        );
        
        return distance <= location.radius;
      });
      
      // Sort by distance
      professionals.sort((a, b) => {
        if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0;
        
        const distanceA = this.calculateDistance(
          location.lat, 
          location.lng, 
          a.latitude, 
          a.longitude
        );
        
        const distanceB = this.calculateDistance(
          location.lat, 
          location.lng, 
          b.latitude, 
          b.longitude
        );
        
        return distanceA - distanceB;
      });
    }
    
    return professionals;
  }

  async getProfessionalById(id: number): Promise<Professional | undefined> {
    return this.professionals.get(id);
  }

  async createProfessional(professional: InsertProfessional): Promise<Professional> {
    const id = this.professionalIdCounter++;
    const newProfessional: Professional = { ...professional, id, rating: 0, ratingCount: 0 };
    this.professionals.set(id, newProfessional);
    return newProfessional;
  }
}

export const storage = new MemStorage();
