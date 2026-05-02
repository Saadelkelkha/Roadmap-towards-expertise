import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";

const SkillTaskSchema = z.object({
  id: z.string(),
  label: z.string(),
  done: z.boolean(),
});

const ProjectStepSchema = z.object({
  id: z.string(),
  label: z.string(),
  done: z.boolean(),
});

const ProgressSchema = z.object({
  version: z.literal(1),
  updatedAt: z.string(),
  // Flexible record so we can add new domains without migrations.
  hoursStudied: z.record(z.number().nonnegative()).default({}),
  dailyNotes: z.record(z.string()).default({}),
  // Flexible record so we can add new domains without migrations breaking parsing.
  skillTasks: z.record(z.array(SkillTaskSchema)).default({}),
  projectSteps: z.record(z.array(ProjectStepSchema)).default({}),
});

export type Progress = z.infer<typeof ProgressSchema>;

const DEFAULT_PROGRESS: Progress = {
  version: 1,
  updatedAt: new Date(0).toISOString(),
  hoursStudied: {
    c_programming: 0,
    data_structures_trees: 0,
    java_enterprise: 0,
    networking: 0,
    math_stats: 0,
    cli_and_french: 0,
    integration_boss: 0,
  },
  dailyNotes: {},
  skillTasks: {
    c_programming: [
      { id: "cprog-l1", label: "Niveau 1 — Les bases (syntaxe, boucles, fonctions)", done: false },
      { id: "cprog-p1", label: "Projet — Bank Management System (console, tableaux, dépôts/retraits)", done: false },
      { id: "cprog-l2", label: "Niveau 2 — Le noyau (pointeurs, structs, mémoire dynamique)", done: false },
      { id: "cprog-p2", label: "Projet — Custom Shell (fork(), exec(), commandes de base)", done: false },
      { id: "cprog-l3", label: "Niveau 3 — Maîtrise (I/O fichiers, erreurs, fuites mémoire)", done: false },
      { id: "cprog-p3", label: "Projet — Binary File Explorer (hex/ASCII, style xxd)", done: false },
    ],
    data_structures_trees: [
      { id: "ds-l1", label: "Niveau 1 — Structures linéaires (listes chaînées, piles, files)", done: false },
      { id: "ds-p1", label: "Projet — Undo/Redo (liste doublement chaînée, états)", done: false },
      { id: "ds-l2", label: "Niveau 2 — Arbres (BST, AVL, heaps)", done: false },
      { id: "ds-p2", label: "Projet — Contact Search Engine (Trie/BST, 5 000 contacts)", done: false },
      { id: "ds-l3", label: "Niveau 3 — Algorithmes (tri, recherche, récursivité)", done: false },
      { id: "ds-p3", label: "Projet — Visualizer CLI (Merge Sort / parcours d’arbre pas à pas)", done: false },
    ],
    java_enterprise: [
      { id: "java-l1", label: "Niveau 1 — Fondamentaux POO (classes, héritage, interfaces)", done: false },
      { id: "java-p1", label: "Projet — University Management (rôles, polymorphisme, permissions)", done: false },
      { id: "java-l2", label: "Niveau 2 — Collections & Streams (List/Map, lambdas)", done: false },
      { id: "java-p2", label: "Projet — E-Commerce Inventory (Maps/Streams, filtres)", done: false },
      { id: "java-l3", label: "Niveau 3 — Spring Boot & Backend", done: false },
      { id: "java-p3", label: "Projet — RESTful Portfolio API (roadmap JSON, JWT)", done: false },
    ],
    networking: [
      { id: "net-l1", label: "Niveau 1 — OSI & bases TCP/UDP", done: false },
      { id: "net-p1", label: "Projet — Ping Tool (ICMP, mesure de latence)", done: false },
      { id: "net-l2", label: "Niveau 2 — Sockets & conception de protocoles", done: false },
      { id: "net-p2", label: "Projet — Multi-Client Chat Server (10+ clients, threads)", done: false },
      { id: "net-l3", label: "Niveau 3 — Analyse avancée", done: false },
      { id: "net-p3", label: "Projet — Packet Sniffer (pcap, HTTP vs HTTPS)", done: false },
    ],
    math_stats: [
      { id: "math-l1", label: "Niveau 1 — Calcul matriciel", done: false },
      { id: "math-p1", label: "Projet — Image Filter Logic (matrice, luminosité)", done: false },
      { id: "math-l2", label: "Niveau 2 — Applications d’algèbre linéaire", done: false },
      { id: "math-p2", label: "Projet — Matrix Calculator CLI (produit, déterminant, fichiers)", done: false },
      { id: "math-l3", label: "Niveau 3 — Statistiques", done: false },
      { id: "math-p3", label: "Projet — Grade Analyzer (loi normale, écart-type)", done: false },
    ],
    cli_and_french: [
      { id: "cli-l1", label: "CLI — Niveau 1 (habitude de navigation)", done: false },
      { id: "cli-l2", label: "CLI — Niveau 2 (scripts Bash)", done: false },
      { id: "cli-p2", label: "Projet — Auto-Backup (zip + upload serveur)", done: false },
      { id: "fr-l1", label: "Français — Niveau 1 (A1/A2 : présent / passé)", done: false },
      { id: "fr-l2", label: "Français — Niveau 2 (B1/B2 : français technique)", done: false },
      { id: "fr-p2", label: "Projet — Le Blog Tech (expliquer les pointeurs en C en français)", done: false },
    ],
    integration_boss: [
      { id: "boss-c", label: "C layer — Capturer le trafic et stocker dans un BST", done: false },
      { id: "boss-math", label: "Math layer — Matrices + statistiques (vitesse moyenne)", done: false },
      { id: "boss-java", label: "Java layer — Spring Boot lit les données (JNI / fichier partagé)", done: false },
      { id: "boss-web", label: "Web layer — Site pro FR/EN + graphes live", done: false },
      { id: "boss-cli", label: "CLI layer — Commande unique: analyze --start", done: false },
    ],
  },
  projectSteps: {
    bank_management_system: [
      { id: "bms-req", label: "Définir les exigences (comptes, dépôts/retraits, règles)", done: false },
      { id: "bms-model", label: "Modéliser les données (structures, champs, contraintes)", done: false },
      { id: "bms-core", label: "Implémenter les opérations (créer compte, dépôt, retrait)", done: false },
      { id: "bms-persist", label: "Sauvegarde simple (fichier texte/binaire) + chargement", done: false },
      { id: "bms-errors", label: "Gestion d’erreurs (entrées invalides, limites, messages)", done: false },
      { id: "bms-tests", label: "Jeux d’essai + scénarios (solde, bordures, stabilité)", done: false },
    ],
    custom_shell: [
      { id: "sh-parse", label: "Parser la ligne de commande (tokens, espaces, quotes simples)", done: false },
      { id: "sh-builtin", label: "Built-ins (cd, exit, help) + gestion du répertoire courant", done: false },
      { id: "sh-forkexec", label: "Exécuter une commande via fork() + exec()", done: false },
      { id: "sh-path", label: "Résolution PATH + messages d’erreur fiables", done: false },
      { id: "sh-status", label: "Codes de retour + affichage d’état", done: false },
      { id: "sh-qol", label: "Qualité: historique minimal / prompt propre / README", done: false },
    ],
    binary_file_explorer: [
      { id: "bfx-io", label: "Lire un fichier binaire (chunks, limites mémoire)", done: false },
      { id: "bfx-hex", label: "Afficher en hex (offset, colonnes, groupements)", done: false },
      { id: "bfx-ascii", label: "Afficher l’ASCII (printable vs '.')", done: false },
      { id: "bfx-cli", label: "Options CLI (offset, length, largeur, fichier)", done: false },
      { id: "bfx-errors", label: "Gestion d’erreurs (fichier absent, permissions, etc.)", done: false },
      { id: "bfx-polish", label: "Finition (format stable, tests manuels, exemples)", done: false },
    ],
    undo_redo_system: [
      { id: "ur-model", label: "Définir le modèle d’état (snapshot / commandes)", done: false },
      { id: "ur-dll", label: "Implémenter la liste doublement chaînée des états", done: false },
      { id: "ur-ops", label: "Opérations: apply / undo / redo", done: false },
      { id: "ur-bounds", label: "Gérer les bordures (début/fin, invalidation redo)", done: false },
      { id: "ur-memory", label: "Gestion mémoire (free des états, pas de fuites)", done: false },
      { id: "ur-demo", label: "Démo CLI (saisie + commandes undo/redo)", done: false },
    ],
    contact_search_engine: [
      { id: "cs-data", label: "Dataset (générer/importer 5 000 contacts)", done: false },
      { id: "cs-struct", label: "Structure: Trie ou BST (choix + implémentation)", done: false },
      { id: "cs-search", label: "Recherche instantanée (prefix / exact) + complexité", done: false },
      { id: "cs-cli", label: "Interface CLI (add, find, list, prefix)", done: false },
      { id: "cs-bench", label: "Benchmark (temps, mémoire) + optimisations simples", done: false },
    ],
    visualizer_cli: [
      { id: "viz-select", label: "Choisir l’algo (merge sort / parcours d’arbre)", done: false },
      { id: "viz-steps", label: "Définir un modèle de “pas” (événements)", done: false },
      { id: "viz-render", label: "Rendu CLI (frames, couleurs, rythme)", done: false },
      { id: "viz-controls", label: "Contrôles (step, play/pause, vitesse)", done: false },
      { id: "viz-samples", label: "Jeux d’exemples + documentation", done: false },
    ],
    university_management: [
      { id: "uni-domain", label: "Modèle de domaine (Admin/Teacher/Student, entités)", done: false },
      { id: "uni-perms", label: "Permissions via polymorphisme / interfaces", done: false },
      { id: "uni-storage", label: "Stockage (en mémoire puis fichier simple)", done: false },
      { id: "uni-cli", label: "CLI / menus (actions par rôle)", done: false },
      { id: "uni-tests", label: "Scénarios + tests unitaires simples", done: false },
    ],
    ecommerce_inventory: [
      { id: "eco-model", label: "Modèle produit + stock + catégories", done: false },
      { id: "eco-collections", label: "Collections (Map/List) + opérations CRUD", done: false },
      { id: "eco-streams", label: "Streams: filtres (prix, catégorie, stock)", done: false },
      { id: "eco-report", label: "Rapports (top produits, ruptures, stats)", done: false },
      { id: "eco-tests", label: "Tests + dataset d’exemple", done: false },
    ],
    restful_portfolio_api: [
      { id: "api-model", label: "Définir ressources & schémas (DTO, validation)", done: false },
      { id: "api-crud", label: "CRUD des données roadmap (JSON → API)", done: false },
      { id: "api-auth", label: "JWT (login, refresh si besoin, roles)", done: false },
      { id: "api-doc", label: "Doc endpoints (OpenAPI/README) + exemples", done: false },
      { id: "api-tests", label: "Tests (unit/integration) + seed data", done: false },
    ],
    ping_tool: [
      { id: "ping-icmp", label: "Choisir approche (raw ICMP / lib) + permissions", done: false },
      { id: "ping-send", label: "Envoi paquet + horodatage", done: false },
      { id: "ping-recv", label: "Réception + calcul RTT", done: false },
      { id: "ping-format", label: "Format output (min/avg/max, pertes)", done: false },
      { id: "ping-errors", label: "Gestion erreurs réseau + timeouts", done: false },
    ],
    chat_server: [
      { id: "chat-proto", label: "Protocole minimal (join, msg, leave)", done: false },
      { id: "chat-server", label: "Serveur socket + gestion clients", done: false },
      { id: "chat-concurrency", label: "Concurrence (threads) + synchronisation", done: false },
      { id: "chat-rooms", label: "Salle globale + broadcast", done: false },
      { id: "chat-hardening", label: "Robustesse (déconnexions, limites, logs)", done: false },
    ],
    packet_sniffer: [
      { id: "sniff-setup", label: "Intégrer libpcap/pcap + permissions", done: false },
      { id: "sniff-capture", label: "Capture trafic (interface, filtres)", done: false },
      { id: "sniff-parse", label: "Parser headers (IP/TCP/UDP) + ports", done: false },
      { id: "sniff-http", label: "Classifier HTTP vs HTTPS (ports, SNI si possible)", done: false },
      { id: "sniff-stats", label: "Compter + afficher stats (périodes, total)", done: false },
    ],
    image_filter_logic: [
      { id: "img-matrix", label: "Représentation matrice (2D) + IO simple", done: false },
      { id: "img-bright", label: "Filtre luminosité (clamp, performance)", done: false },
      { id: "img-extra", label: "Bonus: contraste / kernel simple", done: false },
      { id: "img-cli", label: "CLI (input, output, paramètre)", done: false },
      { id: "img-tests", label: "Tests sur petites matrices + cas limites", done: false },
    ],
    matrix_calculator_cli: [
      { id: "mat-io", label: "Lire 2 matrices 3x3 depuis un fichier", done: false },
      { id: "mat-mul", label: "Produit matriciel", done: false },
      { id: "mat-det", label: "Déterminant 3x3", done: false },
      { id: "mat-cli", label: "CLI + format de sortie", done: false },
      { id: "mat-errors", label: "Gestion erreurs (format, valeurs)", done: false },
    ],
    grade_analyzer: [
      { id: "gr-data", label: "Importer/générer 100 notes", done: false },
      { id: "gr-stats", label: "Moyenne, variance, écart-type", done: false },
      { id: "gr-normal", label: "Distribution normale (approx) + interprétation", done: false },
      { id: "gr-report", label: "Rapport (histogramme textuel/CSV)", done: false },
      { id: "gr-cli", label: "CLI + paramètres", done: false },
    ],
    auto_backup: [
      { id: "ab-zip", label: "Script: zip du projet (exclusions)", done: false },
      { id: "ab-sched", label: "Planification (cron / tâche planifiée)", done: false },
      { id: "ab-upload", label: "Upload (scp/sftp/http) + authentification", done: false },
      { id: "ab-logs", label: "Logs + notifications d’échec", done: false },
      { id: "ab-restore", label: "Procédure de restauration (test)", done: false },
    ],
    le_blog_tech: [
      { id: "blog-plan", label: "Plan (intro, concepts, exemples, pièges)", done: false },
      { id: "blog-vocab", label: "Vocabulaire technique naturel (pointeur, déréférencement…)", done: false },
      { id: "blog-write", label: "Rédiger 500 mots (FR technique)", done: false },
      { id: "blog-review", label: "Relecture (clarté, grammaire, précision)", done: false },
      { id: "blog-publish", label: "Publier (markdown) + exemples code", done: false },
    ],
    integration_boss_project: [
      { id: "boss-cap", label: "C layer: capture trafic + structure BST", done: false },
      { id: "boss-matrix", label: "Math layer: matrices de flux + stats", done: false },
      { id: "boss-bridge", label: "Pont JNI/fichier partagé + format stable", done: false },
      { id: "boss-api", label: "Java layer: API Spring Boot + sécurité", done: false },
      { id: "boss-web", label: "Web layer: dashboard FR/EN + graphes live", done: false },
      { id: "boss-cli", label: "CLI layer: analyze --start (orchestration)", done: false },
      { id: "boss-polish", label: "Packaging + docs + démo", done: false },
    ],
  },
};

function getProgressFilePath() {
  return path.join(process.cwd(), "data", "progress.json");
}

async function ensureProgressFile() {
  const filePath = getProgressFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(DEFAULT_PROGRESS, null, 2), "utf8");
  }
}

export async function readProgress(): Promise<Progress> {
  await ensureProgressFile();
  const raw = await fs.readFile(getProgressFilePath(), "utf8");

  try {
    const parsed = ProgressSchema.parse(JSON.parse(raw));
    const mergedHoursStudied: Record<string, number> = {
      ...DEFAULT_PROGRESS.hoursStudied,
      ...(parsed.hoursStudied ?? {}),
    };
    for (const key of Object.keys(DEFAULT_PROGRESS.hoursStudied)) {
      const v = mergedHoursStudied[key];
      mergedHoursStudied[key] = Number.isFinite(v) && v >= 0 ? v : 0;
    }

    const mergedSkillTasks: Record<string, z.infer<typeof SkillTaskSchema>[]> = {
      ...DEFAULT_PROGRESS.skillTasks,
      ...(parsed.skillTasks ?? {}),
    };
    // If file existed before domains were introduced, inject defaults per domain.
    for (const [key, defaults] of Object.entries(DEFAULT_PROGRESS.skillTasks)) {
      const current = mergedSkillTasks[key];
      if (!Array.isArray(current) || current.length === 0) mergedSkillTasks[key] = defaults;
    }

    const mergedProjectSteps: Record<string, z.infer<typeof ProjectStepSchema>[]> = {
      ...DEFAULT_PROGRESS.projectSteps,
      ...(parsed.projectSteps ?? {}),
    };
    for (const [key, defaults] of Object.entries(DEFAULT_PROGRESS.projectSteps)) {
      const current = mergedProjectSteps[key];
      if (!Array.isArray(current) || current.length === 0) mergedProjectSteps[key] = defaults;
    }

    return {
      ...parsed,
      hoursStudied: mergedHoursStudied,
      skillTasks: mergedSkillTasks,
      projectSteps: mergedProjectSteps,
    };
  } catch {
    // If file is corrupted or outdated, fall back safely.
    return DEFAULT_PROGRESS;
  }
}

export async function writeProgress(next: Omit<Progress, "updatedAt" | "version">) {
  const mergedHoursStudied: Record<string, number> = {
    ...DEFAULT_PROGRESS.hoursStudied,
    ...(next.hoursStudied ?? {}),
  };
  for (const [k, v] of Object.entries(mergedHoursStudied)) {
    mergedHoursStudied[k] = Number.isFinite(v) && v >= 0 ? v : 0;
  }

  const normalized: Progress = {
    version: 1,
    updatedAt: new Date().toISOString(),
    hoursStudied: mergedHoursStudied,
    dailyNotes: next.dailyNotes ?? {},
    skillTasks: next.skillTasks ?? DEFAULT_PROGRESS.skillTasks,
    projectSteps: next.projectSteps ?? DEFAULT_PROGRESS.projectSteps,
  };

  await ensureProgressFile();
  await fs.writeFile(getProgressFilePath(), JSON.stringify(normalized, null, 2), "utf8");
  return normalized;
}

export async function patchProgress(patch: {
  hoursStudied?: Record<string, number>;
  dailyNotes?: Record<string, string>;
  skillTasks?: Partial<Progress["skillTasks"]>;
  projectSteps?: Partial<Progress["projectSteps"]>;
}) {
  const current = await readProgress();
  const nextHoursStudied: Record<string, number> = {
    ...(current.hoursStudied ?? {}),
    ...(patch.hoursStudied ?? {}),
  };
  for (const [k, v] of Object.entries(nextHoursStudied)) {
    nextHoursStudied[k] = Number.isFinite(v) && v >= 0 ? v : 0;
  }

  const merged: Progress = {
    ...current,
    version: 1,
    updatedAt: new Date().toISOString(),
    hoursStudied: nextHoursStudied,
    dailyNotes: {
      ...(current.dailyNotes ?? {}),
      ...(patch.dailyNotes ?? {}),
    },
    skillTasks: {
      ...(current.skillTasks ?? DEFAULT_PROGRESS.skillTasks),
      ...(patch.skillTasks ?? {}),
    },
    projectSteps: {
      ...(current.projectSteps ?? DEFAULT_PROGRESS.projectSteps),
      ...(patch.projectSteps ?? {}),
    },
  };

  await ensureProgressFile();
  await fs.writeFile(getProgressFilePath(), JSON.stringify(merged, null, 2), "utf8");
  return merged;
}

