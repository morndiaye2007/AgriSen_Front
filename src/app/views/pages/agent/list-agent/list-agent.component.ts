import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgentService} from 'src/app/services/agent/agent.service';
import { Alertes } from 'src/app/util/alerte';
import { MatSort, Sort } from '@angular/material/sort';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {saveAs} from "file-saver";
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx-js-style';
import { lastValueFrom } from 'rxjs';



@Component({
  selector: 'app-list-agent',
  templateUrl: './list-agent.component.html',
  styleUrls: ['./list-agent.component.scss']
})
export class ListAgentComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput: any;
    downloadFileName: string = '';
  filePreview: string | null = null;
  selectedFileName: string = '';
  isImage: boolean = false;
  isPdf: boolean = false;
  isDoc: boolean = false;
  selectedFile: File | null = null;
    isExcel: boolean = false;
  dataSources: any = { payload: [] }; // Your data source


  displayedColumns: string[] = [
    'nomComplet',
    'matricule',
    // 'motdepasse',
    'email',
    'description',
    'age',
    'dateNaissance',
    'heure',
    'sexe',
    'notes',
    'preferences',
    'pays',
    'filiere',

    'telephone',
    'actions'
  ];

  // Configuration des colonnes
  availableColumns: any[] = [
    { key: 'nomComplet', label: 'Nom Complet', visible: true, order: 0 },
    { key: 'matricule', label: 'Matricule', visible: true, order: 1 },
    { key: 'email', label: 'Courriel', visible: true, order: 2 },
    { key: 'description', label: 'Description', visible: true, order: 3 },
    { key: 'age', label: 'Âge', visible: true, order: 4 },
    { key: 'dateNaissance', label: 'Date de naissance', visible: true, order: 5 },
    { key: 'heure', label: 'Heure', visible: true, order: 6 },
    { key: 'sexe', label: 'Sexe', visible: true, order: 7 },
    { key: 'notes', label: 'Notes', visible: true, order: 8 },
    { key: 'preferences', label: 'Préférences', visible: true, order: 9 },
    { key: 'pays', label: 'Pays de résidence', visible: true, order: 10 },
    { key: 'filiere', label: 'Filière', visible: true, order: 11 },
    { key: 'telephone', label: 'Téléphone', visible: true, order: 12 },
    { key: 'actions', label: 'Actions', visible: true, order: 13, fixed: true }
  ];

  agentToUpdate: any;
  pageOptions: any = { page: 0, size: 10 };
  agents: any;
  dataSource: any = []; //  Initialisation avec un tableau vide
  loadingIndicator = true;
  exportFormat: string = 'pdf';


  data: any;

  constructor(
    private modalService: NgbModal,
    private agentServices: AgentService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadColumnConfiguration();
    this.getAllAgents();
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.sort.sortChange.subscribe((s: Sort) => {
        const sortKeyMap: Record<string, string> = {
          nomComplet: 'nomComplet',
          matricule: 'matricule',
          email: 'email',
          description: 'description',
          age: 'age',
          dateNaissance: 'dateNaissance',
          heure: 'heure',
          sexe: 'sexe.description',
          notes: 'notes',
          pays: 'pays.libelle',
          filiere: 'filiere.libelle',
          telephone: 'telephone'
        };
        const mapped = sortKeyMap[s.active];
        if (!mapped) {
          // Colonnes non triables (ex: preferences, actions)
          return;
        }
        const direction = s.direction || 'asc';
        this.pageOptions = {
          ...this.pageOptions,
          sort: `${mapped},${direction}`
        };
        this.getAllAgents();
      });
    }
  }

  getAllAgents() {
    console.log('🔍 Paramètres de pagination:', this.pageOptions);

    this.loadingIndicator = true; //  S'assurer que le loading est activé

    this.agentServices.getAllAgents(this.pageOptions).subscribe({
      next: response => {
        console.log(' Response reçue:', response);
        console.log(' Type de response:', typeof response);
        console.log(' Est-ce un tableau?', Array.isArray(response));

        //  Gestion flexible de la structure des données
        if (response) {
          // Si c'est une réponse avec payload (votre API)
          if (response.payload && Array.isArray(response.payload)) {
            this.dataSource = response;
            console.log(' Réponse avec payload détectée');
          }
          // Si c'est une réponse paginée (ex: Spring Boot)
          else if (response.content && Array.isArray(response.content)) {
            this.dataSource = response.content;
            console.log(' Données paginées détectées');
          }
          // Si c'est directement un tableau
          else if (Array.isArray(response)) {
            this.dataSource = response;
            console.log(' Tableau direct détecté');
          }
          // Si c'est un objet avec une propriété data
          else if (response.data && Array.isArray(response.data)) {
            this.dataSource = response.data;
            console.log(' Propriété data détectée');
          }
          // Sinon, utiliser la réponse telle quelle
          else {
            this.dataSource = response;
            console.log(' Structure personnalisée');
          }
        } else {
          this.dataSource = [];
          console.warn(' Réponse vide ou nulle');
        }

        console.log(' DataSource final:', this.dataSource);
        console.log(' Nombre d\'agents:', this.dataSource?.length || 0);

        this.loadingIndicator = false;
      },
      error: err => {
        console.error(' Erreur lors de la récupération des agents:', err);
        console.error(' Détails de l\'erreur:', {
          status: err.status,
          message: err.message,
          url: err.url
        });

        this.dataSource = [];
        this.loadingIndicator = false;

        //  Afficher une alerte d'erreur
        Alertes.alerteAddDanger('Erreur lors du chargement des agents');
      },
      complete: () => {
        this.loadingIndicator = false;
        console.log(' Chargement terminé');
      }
    });
  }

  paginate($event: any) {
    console.log(' Pagination demandée:', $event);

    //  Validation de l'événement de pagination
    if ($event && typeof $event === 'number' && $event > 0) {
      this.loadingIndicator = true;
      this.pageOptions.page = $event - 1;
      this.getAllAgents();
    } else {
      console.warn(' Événement de pagination invalide:', $event);
    }
  }

  openAddAgent(content: TemplateRef<any>) {
    this.openModal(content, 'lg');
  }

  openEditAgent(content: TemplateRef<any>, agent: any) {
    this.agentToUpdate = agent;
    console.log(" Agent à modifier:", this.agentToUpdate);
    this.openModal(content, 'lg');
  }

  DeleteAgent(agent: any) {
    if (!agent) {
      console.warn(' Aucun agent sélectionné pour suppression');
      return;
    }

    Alertes.confirmAction("Voulez-vous supprimer ?", "Cet agent sera supprimé", () => {
      this.deleteAgent(agent);
    });
  }

  openModal(content: TemplateRef<any>, size: 'sm' | 'lg' | 'xl' = 'sm') {
    this.modalService.open(content, { size: size, backdrop: 'static' })
        .result
        .then(result => console.log('Modal fermée avec résultat:', result))
        .catch(res => console.log('Modal fermée sans résultat:', res));
  }


  deleteAgent(agent: any) {
    Alertes.confirmAction(
      'Voulez-vous supprimer ?',
      'Cet élément sera définitivement supprimé',
      () => {
        this.agentServices.deleteAgent(agent).subscribe({
          next: (value) => {
            console.log(' Agent supprimé:', value);
            Alertes.alerteAddSuccess('Suppression réussie');
          },
          error: (value) => {
            console.error(' Erreur suppression:', value);
            Alertes.alerteAddDanger(value.error?.message || 'Erreur lors de la suppression');
          },
          complete: () => {
            this.getAllAgents();
          },
        });
      }
    );
  }

  close() {
    this.modalService.dismissAll();
    this.getAllAgents();
  }

  doSearch(data: any) {
    console.log(' Recherche avec filtres:', data);

    this.pageOptions = { ...data }; //  Copie de l'objet au lieu d'assignation directe
    this.pageOptions.page = 0;
    this.pageOptions.size = 20;

    console.log(" Paramètres de filtrage:", this.pageOptions);
    this.getAllAgents();
    this.modalService.dismissAll();
  }

  //  Méthode trackBy pour optimiser le rendu de la liste
  trackByAgent(index: number, agent: any): any {
    return agent.id || agent.matricule || index;
  }



  // Mappages pour les enums
  private readonly sexeMappings: { [key: string]: string } = {
    'masculin': 'MASCULIN',
    'féminin': 'FEMININ',
    'autre': 'AUTRE'
  };

  private readonly typeContratMapping: { [key: string]: string } = {
    'contrat à durée indéterminée': 'CDI',
    'contrat à durée déterminée': 'CDD',
    'freelance': 'FREELANCE'
  };

  private readonly statutAgentMapping: { [key: string]: string } = {
    'actif': 'ACTIF',
    'inactif': 'INACTIF'
  };

  private readonly preferencesMapping: { [key: string]: string } = {
    'sport': 'SPORT',
    'lecture': 'LECTURE'
  };


  onPageSizeChange() {
    console.log('🔄 Changement de taille de page:', this.pageOptions.size);
    this.pageOptions.page = 0; // Reset to first page
    this.getAllAgents();
  }

  // Gestion des colonnes
  @ViewChild('columnConfigModal') columnConfigModal!: TemplateRef<any>;

  openColumnConfig() {
    this.openModal(this.columnConfigModal, 'lg');
  }

  getVisibleColumns(): string[] {
    return this.availableColumns
      .filter(col => col.visible)
      .sort((a, b) => a.order - b.order)
      .map(col => col.key);
  }

  getVisibleColumnConfig(): any[] {
    return this.availableColumns
      .filter(col => col.visible)
      .sort((a, b) => a.order - b.order);
  }

  toggleColumnVisibility(column: any) {
    if (column.fixed) return; // Ne pas permettre de cacher les colonnes fixes
    column.visible = !column.visible;
  }

  trackByColumn(index: number, column: any): any {
    return column.key;
  }

  moveColumnUp(column: any) {
    const visibleColumns = this.getVisibleColumnConfig();
    const currentIndex = visibleColumns.findIndex(col => col.key === column.key);
    if (currentIndex > 0) {
      const previousColumn = visibleColumns[currentIndex - 1];
      const tempOrder = column.order;
      column.order = previousColumn.order;
      previousColumn.order = tempOrder;
    }
  }

  moveColumnDown(column: any) {
    const visibleColumns = this.getVisibleColumnConfig();
    const currentIndex = visibleColumns.findIndex(col => col.key === column.key);
    if (currentIndex < visibleColumns.length - 1) {
      const nextColumn = visibleColumns[currentIndex + 1];
      const tempOrder = column.order;
      column.order = nextColumn.order;
      nextColumn.order = tempOrder;
    }
  }

  isFirstVisibleColumn(column: any): boolean {
    const visibleColumns = this.getVisibleColumnConfig();
    return visibleColumns.length > 0 && visibleColumns[0].key === column.key;
  }

  isLastVisibleColumn(column: any): boolean {
    const visibleColumns = this.getVisibleColumnConfig();
    return visibleColumns.length > 0 && visibleColumns[visibleColumns.length - 1].key === column.key;
  }

  dropColumn(event: CdkDragDrop<any[]>) {
    const visibleColumns = this.getVisibleColumnConfig();
    moveItemInArray(visibleColumns, event.previousIndex, event.currentIndex);

    // Réorganiser les ordres
    visibleColumns.forEach((col, index) => {
      col.order = index;
    });
  }

  selectAllColumns() {
    this.availableColumns.forEach(col => {
      if (!col.fixed) col.visible = true;
    });
  }

  deselectAllColumns() {
    this.availableColumns.forEach(col => {
      if (!col.fixed) col.visible = false;
    });
  }

  resetColumnsToDefault() {
    this.availableColumns.forEach((col, index) => {
      col.visible = true;
      col.order = index;
    });
  }

  saveColumnConfiguration(modal: any) {
    const config = {
      columns: this.availableColumns.map(col => ({
        key: col.key,
        visible: col.visible,
        order: col.order
      }))
    };
    localStorage.setItem('agentListColumnConfig', JSON.stringify(config));
    modal.close();
    Alertes.alerteAddSuccess('Configuration des colonnes sauvegardée');
  }

  loadColumnConfiguration() {
    const savedConfig = localStorage.getItem('agentListColumnConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        if (config.columns) {
          config.columns.forEach((savedCol: any) => {
            const column = this.availableColumns.find(col => col.key === savedCol.key);
            if (column) {
              column.visible = savedCol.visible;
              column.order = savedCol.order;
            }
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration des colonnes:', error);
      }
    }
  }


  getPreferences(preferences:any[]){
    if (preferences && preferences.length > 0){
      let preferencesDescription = '';
      preferences.forEach(preference =>{
        preferencesDescription += preference.description + ', ';
      })
      return preferencesDescription.slice(0, -2)
    }else{return ''}
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    this.selectedFileName = file.name;
    const fileType = file.type;
    const fileExtension = this.selectedFileName.split('.').pop()?.toLowerCase();

    this.isImage = fileType.startsWith('image/');
    this.isPdf = fileType === 'application/pdf';
    this.isDoc = fileType.includes('word') || fileType.includes('msword');
    this.isExcel = ['xlsx', 'xls', 'csv'].includes(fileExtension || '');

    if (this.isImage) {
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else if (this.isPdf || this.isDoc || this.isExcel) {
      this.filePreview = 'ok';
    } else {
      Alertes.alerteAddDanger('Type de fichier non supporté');
      this.selectedFile = null;
      this.selectedFileName = '';
      this.filePreview = null;
    }
  }

    exportToCsv() {
        this.loadingIndicator = true;

        try {
            const columns = [
                { header: 'Matricule', dataKey: 'matricule' },
                { header: 'Nom Complet', dataKey: 'nomComplet' },
                { header: 'Email', dataKey: 'email' },
                { header: 'Téléphone', dataKey: 'telephone' },
                { header: 'Sexe', dataKey: 'sexe' },
                { header: 'Âge', dataKey: 'age' },
                { header: 'Date de Naissance', dataKey: 'dateNaissance' },
                { header: 'Heure', dataKey: 'heure' },
                { header: 'Pays', dataKey: 'pays' },
                { header: 'Langue', dataKey: 'langue' },
                { header: 'Type de Contrat', dataKey: 'typeContrat' },
                { header: 'Statut Agent', dataKey: 'statutAgent' },
                { header: 'Poste', dataKey: 'poste' },
                { header: 'Filière', dataKey: 'filiere' },
                { header: 'Notes', dataKey: 'notes' },
                { header: 'Préférences', dataKey: 'preferences' }
            ];

            const uniqueData = Array.from(
                new Map(
                    this.dataSource.payload.map((item: any) => [item.matricule, item])
                ).values()
            );

            const data = uniqueData.map((item: any) => {
                return {
                    matricule: item.matricule || '',
                    nomComplet: item.nomComplet || '',
                    email: item.email || '',
                    telephone: item.telephone || '',
                    sexe: this.getSafeValue(item.sexe, ['name', 'description'], 'Inconnu') || '',
                    age: item.age || '',
                    dateNaissance: item.dateNaissance
                        ? new Date(item.dateNaissance).toLocaleDateString('fr-FR')
                        : '',
                    // ✅ Correction robuste pour heure
                    heure: (() => {
                        if (!item.heure) return '';
                        if (typeof item.heure === 'string') return item.heure;
                        if (
                            typeof item.heure.hour === 'number' &&
                            typeof item.heure.minute === 'number' &&
                            typeof item.heure.second === 'number'
                        ) {
                            return `${String(item.heure.hour).padStart(2, '0')}:${String(
                                item.heure.minute
                            ).padStart(2, '0')}:${String(item.heure.second).padStart(2, '0')}`;
                        }
                        return '';
                    })(),
                    pays: this.getSafeValue(item.pays, ['libelle'], 'Inconnu') || '',
                    langue: this.getSafeValue(item.langue, ['libelle'], 'Inconnu') || '',
                    typeContrat: this.getSafeValue(item.typeContrat, ['name', 'description'], 'Inconnu') || '',
                    statutAgent: this.getSafeValue(item.statutAgent, ['name', 'description'], 'Inconnu') || '',
                    poste: this.getSafeValue(item.poste, ['intitule', 'departementLibelle'], 'Inconnu') || '',
                    filiere: this.getSafeValue(item.filiere, ['nom'], 'Inconnu') || '',
                    notes: item.notes || '',
                    preferences: Array.isArray(item.preferences)
                        ? item.preferences
                            .map((pref: any) => this.getSafeValue(pref, ['name', 'description'], pref) || '')
                            .join(', ')
                        : this.getSafeValue(item.preferences, ['name', 'description'], item.preferences || '') || ''
                };
            });

            const ws = XLSX.utils.aoa_to_sheet([
                ['Liste des Agents'],
                columns.map(col => col.header),
                ...data.map((row: any) => columns.map(col => row[col.dataKey] || ''))
            ]);

            // Fusion pour le titre
            const titleRange = { s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } };
            ws['!merges'] = [titleRange];
            const titleCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
            ws[titleCell] = ws[titleCell] || {};
            ws[titleCell].v = 'Liste des Agents';
            ws[titleCell].s = {
                fill: { fgColor: { rgb: 'FFFF00' } },
                font: { bold: true },
                alignment: { horizontal: 'center' }
            };

            // Style entêtes
            const headerStyle = { fill: { fgColor: { rgb: 'FFFF00' } }, font: { bold: true } };
            for (let col = 0; col < columns.length; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: 1, c: col });
                if (!ws[cellAddress]) ws[cellAddress] = { v: columns[col].header };
                ws[cellAddress].s = headerStyle;
            }

            // Largeur auto des colonnes
            ws['!cols'] = columns.map((col, index) => ({
                wch:
                    Math.max(
                        col.header.length,
                        ...data.map((row: any) => String(row[col.dataKey] || '').length)
                    ) + 2
            }));

            // Création du fichier Excel
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Agents');

            const excelOutput = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const excelBlob = new Blob([excelOutput], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            saveAs(excelBlob, `Agents_${new Date().toISOString().replace(/[:.]/g, '-')}.xlsx`);

            // Création du fichier CSV
            const csvOutput = XLSX.utils.sheet_to_csv(ws, { FS: ',', RS: '\n' });
            const csvBlob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
            saveAs(csvBlob, `Agents_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`);

            Alertes.alerteAddSuccess('Exportation réussie');
            this.loadingIndicator = false;
        } catch (err) {
            console.error('Erreur export:', err);
            Alertes.alerteAddDanger("Erreur lors de l'exportation");
            this.loadingIndicator = false;
        }
    }



    async importFile() {
    if (!this.selectedFile) {
      Alertes.alerteAddDanger('Aucun fichier sélectionné');
      return;
    }

    const fileExtension = this.selectedFileName.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(fileExtension || '')) {
      Alertes.alerteAddDanger('Seuls les fichiers Excel (.xlsx, .xls) ou CSV sont acceptés');
      return;
    }

    this.loadingIndicator = true;
    const reader = new FileReader();

    // helper: try to fix mojibake (ex: "TÃ©lÃ©phone" -> "Téléphone")
    const fixMojibake = (s: string): string => {
      try {
        return decodeURIComponent(escape(s));
      } catch (e) {
        return s;
      }
    };

    // helper: normalize header cell for matching
    const normalizeHeader = (h: any): string => {
      if (h == null) return '';
      let s = String(h).trim();
      if (s.charCodeAt(0) === 0xFEFF) s = s.slice(1);
      if (/[ÃÂ]/.test(s)) {
        const fixed = fixMojibake(s);
        if (fixed && fixed.length > 0) s = fixed;
      }
      return s
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
    };

    reader.onload = async (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        console.log('Raw jsonData:', jsonData);

        if (!jsonData || jsonData.length === 0) {
          throw new Error('Le fichier est vide ou invalide');
        }

        let headerRowIndex = 0;
        const firstRow = jsonData[0] || [];
        const secondRow = jsonData[1] || [];

        const firstRowText = (firstRow.join(' ') || '').toString().toLowerCase();
        if (
            (firstRow.length === 1 && /(liste|agents|agents?)/i.test(firstRowText)) ||
            (firstRow.length < Math.max(2, Math.floor(secondRow.length / 2)))
        ) {
          headerRowIndex = 1;
        }

        if (jsonData.length <= headerRowIndex) {
          throw new Error('Le fichier ne contient pas d\'en-têtes valides');
        }

        const rawHeaderRow = jsonData[headerRowIndex] as any[];
        const header = rawHeaderRow.map(h => normalizeHeader(h));

        console.log('Detected headerRowIndex:', headerRowIndex, 'Normalized header:', header);

        const expectedHeaders = [
          'matricule', 'nom complet', 'email', 'telephone', 'sexe', 'age', 'date de naissance',
          'pays', 'langue', 'type de contrat', 'statut agent', 'description', 'heure', 'notes', 'preferences'
        ];

        const headerSynonyms: { [key: string]: string[] } = {
          'matricule': ['matricule', 'id', 'code', 'id agent', 'agent id', 'identifiant'],
          'nom complet': ['nom complet', 'nom', 'full name', 'prenom et nom'],
          'email': ['email', 'courriel', 'e-mail', 'adresse email', 'mail', 'adresse e-mail'],
          'telephone': ['telephone', 'téléphone', 'phone', 'tel', 'numero', 'numéro', 'numéro de téléphone'],
          'sexe': ['sexe', 'genre', 'sex', 'gender'],
          'age': ['age', 'âge'],
          'date de naissance': ['date de naissance', 'date naissance', 'birth date', 'dob', 'naissance'],
          'pays': ['pays', 'country', 'pays origine', 'nationalite', 'nationalité'],
          'langue': ['langue', 'language', 'lang'],
          'type de contrat': ['type de contrat', 'contrat', 'contract type', 'type contrat'],
          'statut agent': ['statut agent', 'statut', 'status', 'etat', 'état'],
          'description': ['description', 'desc', 'commentaire', 'commentaires'],
          'heure': ['heure', 'time', 'horaire'],
          'notes': ['notes', 'score', 'note', 'évaluation'],
          'preferences': ['preferences', 'préférences', 'prefs', 'préférence']
        };

        const normSynonyms: { [k: string]: string[] } = {};
        for (const key of Object.keys(headerSynonyms)) {
          normSynonyms[key] = headerSynonyms[key].map(s =>
              s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim()
          );
        }

        // Build column map: fileColIndex -> expectedHeaderKey
        const columnMap = new Map<number, string>();
        expectedHeaders.forEach(expected => {
          const synonyms = normSynonyms[expected] || [];
          const foundIndex = header.findIndex(h => synonyms.includes(h));
          // Map found headers to their index, or -1 for missing headers
          columnMap.set(foundIndex !== -1 ? foundIndex : -1, expected);
        });

        // Try fuzzy matching for unmapped headers
        const unmappedHeaders = expectedHeaders.filter(h => ![...columnMap.values()].includes(h));
        unmappedHeaders.forEach((miss) => {
          const candidates = header.map((h, idx) => ({ h, idx }))
              .filter(x => x.h && (x.h.includes(miss.split(' ')[0]) || miss.includes(x.h)));
          if (candidates.length === 1) {
            columnMap.set(candidates[0].idx, miss);
          } else {
            // Ensure all expected headers are in columnMap, even if missing
            if (![...columnMap.values()].includes(miss)) {
              columnMap.set(-1, miss);
            }
          }
        });

        // Log headers for debugging
        console.log('Final columnMap:', [...columnMap.entries()]);

        // Prepare maps for pays/langue
        let paysMap = new Map<string, number>();
        let langueMap = new Map<string, number>();
        try {
          const paysResponse: any = await lastValueFrom(this.agentServices.getAllPaysPaginated());
          if (paysResponse?.payload && Array.isArray(paysResponse.payload)) {
            paysMap = new Map(paysResponse.payload.map((p: any) =>
                [String(p.libelle || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), p.id]
            ));
          }
        } catch (err) {
          console.warn('Impossible d\'obtenir la liste des pays, utilisation des valeurs par défaut', err);
        }

        try {
          const langueResponse: any = await lastValueFrom(this.agentServices.getAllLangues());
          if (Array.isArray(langueResponse)) {
            langueMap = new Map(langueResponse.map((l: any) =>
                [String(l.libelle || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), l.id]
            ));
          }
        } catch (err) {
          console.warn('Impossible d\'obtenir la liste des langues, utilisation des valeurs par défaut', err);
        }

        // Iterate rows starting after headerRowIndex
        const seenEmails = new Set<string>();
        const dataRows = jsonData.slice(headerRowIndex + 1);
        const agents = dataRows.map((row: any[], rowIndex: number) => {
          if (!row || row.every(cell => cell == null || String(cell).trim() === '')) return null;

          const getColumnValue = (key: string): string | null => {
            const entry = [...columnMap.entries()].find(([idx, v]) => v === key);
            if (!entry || entry[0] === -1) {
              // Return default values for missing columns
              if (key === 'description') return 'Agent importé';
              if (key === 'heure') return '09:30:00';
              // Define other default values as needed
              if (key === 'matricule') return `AGENT_${rowIndex + 1}`;
              if (key === 'nom complet') return `Agent ${rowIndex + 1}`;
              if (key === 'email') return `agent${rowIndex + 1}@example.com`;
              if (key === 'telephone') return '+221770000000';
              if (key === 'sexe') return 'MASCULIN';
              if (key === 'age') return '30';
              if (key === 'date de naissance') return '1993-05-14';
              if (key === 'pays') return 'Sénégal';
              if (key === 'langue') return 'Français';
              if (key === 'type de contrat') return 'CDI';
              if (key === 'statut agent') return 'ACTIF';
              if (key === 'notes') return '4.5';
              if (key === 'preferences') return 'SPORT,LECTURE';
              return null;
            }
            const colIndex = entry[0];
            const raw = row[colIndex];
            if (raw == null) return null;
            let s = String(raw).trim();
            if (s.charCodeAt(0) === 0xFEFF) s = s.slice(1);
            if (/[ÃÂ]/.test(s)) {
              const fixed = fixMojibake(s);
              if (fixed && fixed.length > 0) s = fixed;
            }
            return s;
          };

          try {
            const matricule = getColumnValue('matricule');
            const nomComplet = getColumnValue('nom complet');
            let email = getColumnValue('email') || `agent${matricule}@example.com`;
            if (seenEmails.has(email)) throw new Error(`Ligne ${headerRowIndex + rowIndex + 2}: Email dupliqué (${email})`);
            seenEmails.add(email);
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error(`Ligne ${headerRowIndex + rowIndex + 2}: Email invalide (${email})`);

            const sexe = getColumnValue('sexe');
            const typeContrat = getColumnValue('type de contrat');
            const statutAgent = getColumnValue('statut agent');
            const preferences = getColumnValue('preferences') || getColumnValue('préférences');
            const pays = getColumnValue('pays');
            const langue = getColumnValue('langue');
            const heure = getColumnValue('heure');
            const age = getColumnValue('age') ? Number(getColumnValue('age')) : null;
            const notes = getColumnValue('notes') ? Number(getColumnValue('notes')) : null;
            const dateNaissance = getColumnValue('date de naissance');

            const defaultPaysId = paysMap.get('senegal') || 1;
            const defaultLangueId = langueMap.get('francais') || 1;

            return {
              matricule,
              nomComplet,
              email,
              motdepasse: 'Password@123',
              description: getColumnValue('description') || 'Agent importé',
              age,
              dateNaissance: dateNaissance ? this.formatDateToBackend(dateNaissance) : '1993-05-14T00:00:00.000Z',
              heure: heure ? this.formatTimeToBackend(heure) : '09:30:00',
              sexe: sexe ? this.sexeMappings[sexe.toLowerCase()] || 'MASCULIN' : 'MASCULIN',
              preferences: preferences ? preferences.split(/[,;|]/).map((p: string) => (this.preferencesMapping[p.trim().toLowerCase()] || p.trim().toUpperCase())) : ['SPORT', 'LECTURE'],
              telephone: getColumnValue('telephone') || '+221770000000',
              pays: pays && paysMap.get(pays.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) ? { id: paysMap.get(pays.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')), code: 'SN', libelle: pays } : { id: defaultPaysId, code: 'SN', libelle: 'Sénégal' },
              paysId: pays ? (paysMap.get(pays.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) || defaultPaysId) : defaultPaysId,
              statutAgent: statutAgent ? this.statutAgentMapping[statutAgent.toLowerCase()] || 'ACTIF' : 'ACTIF',
              typeContrat: typeContrat ? this.typeContratMapping[typeContrat.toLowerCase()] || 'CDI' : 'CDI',
              notes: notes ? Math.min(notes, 5) : 4.5,
              langue: langue && langueMap.get(langue.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) ? { id: langueMap.get(langue.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')), code: 'FR', libelle: langue } : { id: defaultLangueId, code: 'FR', libelle: 'Français' },
              fileName: null,
              fileType: null,
              fileData: null,
              fileBase64: null
            };
          } catch (rowErr: any) {
            console.warn('Ligne ignorée pour cause d\'erreur:', rowErr.message);
            return null;
          }
        }).filter(a => a !== null);

        if (!agents.length) {
          Alertes.alerteAddDanger('Aucune donnée valide trouvée dans le fichier');
          this.loadingIndicator = false;
          return;
        }

        console.log('Agents to import:', agents);
        this.agentServices.importAgents(agents).subscribe({
          next: () => {
            Alertes.alerteAddSuccess('Importation réussie');
            this.modalService.dismissAll();
            this.getAllAgents();
            this.loadingIndicator = false;
            this.selectedFile = null;
            this.selectedFileName = '';
            this.filePreview = null;
          },
          error: (err) => {
            console.error('Erreur lors de l\'importation:', err);
            Alertes.alerteAddDanger(err?.error?.message || 'Erreur lors de l\'importation');
            this.loadingIndicator = false;
          }
        });

      } catch (err: any) {
        console.error('Erreur traitement fichier:', err);
        Alertes.alerteAddDanger(err.message || 'Erreur lors du traitement du fichier');
        this.loadingIndicator = false;
      }
    };

    reader.readAsArrayBuffer(this.selectedFile!);
  }


  private formatTimeToBackend(time: string): string | null {
    if (!time) return null;
    try {
      const [hours, minutes, seconds = '00'] = time.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    } catch (e) {
      console.warn(`Format de temps invalide: ${time}`);
      return null;
    }
  }

  private formatDateToBackend(date: any): string | null {
    if (!date) return null;
    try {
      if (typeof date === 'object' && date instanceof Date) {
        return date.toISOString();
      }
      const dateStr = date.toString().trim();
      if (/^\d+\.\d+$/.test(dateStr)) {
        const excelEpoch = new Date(1899, 11, 30);
        const msPerDay = 24 * 60 * 60 * 1000;
        const days = Math.floor(parseFloat(dateStr));
        const ms = Math.round((parseFloat(dateStr) - days) * msPerDay);
        const dateObj = new Date(excelEpoch.getTime() + days * msPerDay + ms);
        return dateObj.toISOString();
      }
      const [day, month, year] = dateStr.split('/');
      if (day && month && year) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000Z`;
      }
      throw new Error('Format de date invalide');
    } catch (e) {
      console.warn(`Format de date invalide: ${date}`);
      return null;
    }
  }


  exportData(format: string) {
    if (!this.dataSource?.payload?.length) {
      Alertes.alerteAddDanger('Aucune donnée à exporter');
      return;
    }

    switch (format) {
      case 'excel':
        this.exportToCsv();
        break;
      case 'pdf':
        this.exportToPdf();
        break;
      default:
        Alertes.alerteAddDanger('Format non supporté');
    }
  }

  printAgents(){}


  exportToPdf() {
    const doc = new   jsPDF.default();
    console.log('dataSource.payload:', this.dataSource.payload);
    if (this.dataSource.payload?.length > 0) {
      console.log('Sample item:', this.dataSource.payload[0]);
    }

    const columns = [
      { header: 'Matricule', dataKey: 'matricule' },
      { header: 'Nom Complet', dataKey: 'nomComplet' },
      { header: 'Email', dataKey: 'email' },
      { header: 'Téléphone', dataKey: 'telephone' },
      { header: 'Sexe', dataKey: 'sexe' },
      { header: 'Âge', dataKey: 'age' },
      { header: 'Date de Naissance', dataKey: 'dateNaissance' },
      { header: 'Pays', dataKey: 'pays' },
      { header: 'Langue', dataKey: 'langue' },
      { header: 'Type de Contrat', dataKey: 'typeContrat' },
      { header: 'Statut Agent', dataKey: 'statutAgent' },
      { header: 'Poste', dataKey: 'poste' },
      { header: 'Filière', dataKey: 'filiere' },
      { header: 'Notes', dataKey: 'notes' },
      { header: 'Préférences', dataKey: 'preferences' }
    ];

    // Map data with enhanced handling
    const data = this.dataSource.payload.map((item: any) => ({
      matricule: item.matricule || '',
      nomComplet: item.nomComplet || '',
      email: item.email || '',
      telephone: item.telephone || '',
      sexe: this.getSafeValue(item.sexe, ['description', 'libelle', 'name'], '') || '',
      age: item.age || '',
      dateNaissance: item.dateNaissance ? new Date(item.dateNaissance).toLocaleDateString('fr-FR') : '',
      pays: this.getSafeValue(item.pays, ['libelle', 'description', 'name'], '') || '',
      langue: this.getSafeValue(item.langue, ['libelle', 'description', 'name'], '') || '',
      typeContrat: this.getSafeValue(item.typeContrat, ['description', 'libelle', 'name'], '') || '',
      statutAgent: this.getSafeValue(item.statutAgent, ['description', 'libelle', 'name'], '') || '',
      poste: this.getSafeValue(item.poste, ['intitule', 'description', 'libelle'], '') || '', // Default to empty
      filiere: this.getSafeValue(item.filiere, ['libelle', 'description', 'name'], '') || '', // Default to empty
      notes: item.notes || '',
      preferences: Array.isArray(item.preferences)
          ? item.preferences.map((pref: any) => this.getSafeValue(pref, ['description', 'libelle', 'name'], pref) || '').join(', ')
          : this.getSafeValue(item.preferences, ['description', 'libelle', 'name'], item.preferences || '') || ''
    }));

    // Set title
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Liste des Agents', 14, 20);

    // Configure autoTable
    (doc as any).autoTable({
      head: [columns.map(col => col.header)],
      body: data.map((row: any) => columns.map(col => row[col.dataKey] || '')),
      startY: 25,
      theme: 'grid',
      headStyles: {
        fillColor: [255, 255, 0],
        textColor: [0, 0, 0],
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'left',
        cellPadding: 2
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 2,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      columnStyles: columns.reduce((styles: any, col: any) => {
        // Dynamically adjust column width based on max content length
        const maxLength = Math.max(
            col.header.length,
            ...data.map((row: any) => String(row[col.dataKey] || '').length)
        );
        styles[col.dataKey] = { cellWidth: Math.min(maxLength * 3, 40) }; // Cap at 40 to prevent overflow
        return styles;
      }, {}),
      margin: { top: 25, left: 7, right: 7 },
      styles: {
        overflow: 'linebreak',
        cellPadding: 2,
        fontSize: 7
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      didDrawPage: (data: any) => {
        doc.setFontSize(7);
        doc.setTextColor(100);
        doc.text(
            `Page ${data.pageNumber} / ${doc.getNumberOfPages()}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 8
        );
      }
    });

    doc.save(`Agents_${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`);
  }
  private getSafeValue(obj: any, keys: string[], defaultValue: string = ''): string {
    if (!obj) return defaultValue;
    for (const key of keys) {
      const value = obj[key];
      if (value !== undefined && value !== null) return value.toString();
    }
    return obj.toString() || defaultValue;
  }


    // Dans la classe ListAgentComponent
    downloadTemplate() {
        try {
            // Définir les en-têtes du modèle
            const templateHeaders = [
                'nomComplet',
                'matricule',
                'email',
                'description',
                'age',
                'dateNaissance',
                'heure',
                'sexe',
                'notes',
                'preferences',
                'pays',
                'filiere',
                'telephone'
            ];

            // Créer une feuille de calcul avec les en-têtes
            const ws = XLSX.utils.json_to_sheet([], { header: templateHeaders });

            // Appliquer un style bleu pour les en-têtes
            const headerStyle = {
                fill: { fgColor: { rgb: 'FFADD8E6' } }, // Couleur bleu clair (#ADD8E6)
                font: { bold: true, color: { rgb: 'FFFFFFFF' } }, // Texte en blanc
                alignment: { horizontal: 'center', vertical: 'center' }
            };

            // Appliquer le style à chaque cellule de l'en-tête
            templateHeaders.forEach((header, index) => {
                const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
                if (!ws[cellAddress]) ws[cellAddress] = { v: header };
                ws[cellAddress].s = headerStyle;
            });

            // Définir la largeur des colonnes
            ws['!cols'] = templateHeaders.map(() => ({ wch: 15 })); // Largeur fixe pour chaque colonne

            // Créer un classeur et ajouter la feuille
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Modèle Agents');

            // Générer le fichier Excel
            const excelOutput = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const excelBlob = new Blob([excelOutput], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            // Télécharger le fichier
            saveAs(excelBlob, 'Modele_Agents.xlsx');

            // Mettre à jour downloadFileName pour l'affichage
            this.downloadFileName = 'Modele_Agents.xlsx';
            Alertes.alerteAddSuccess('Modèle téléchargé avec succès');
        } catch (err) {
            console.error('Erreur lors de la création du modèle:', err);
            Alertes.alerteAddDanger('Erreur lors de la création du modèle');
        }
    }

}

