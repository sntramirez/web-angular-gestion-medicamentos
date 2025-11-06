import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Medicamento, MedicamentoRequest } from '../models/medicamento.model';

@Injectable({
  providedIn: 'root'
})
export class MedicamentosService {
  private medicamentosDataUrl = '/assets/data/medicamentos.json';
  private medicamentosSubject = new BehaviorSubject<Medicamento[]>([]);
  public medicamentos$ = this.medicamentosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadMedicamentos();
  }

  private loadMedicamentos(): void {
    this.http.get<{ medicamentos: Medicamento[] }>(this.medicamentosDataUrl).pipe(
      map(response => this.processMedicamentos(response.medicamentos))
    ).subscribe(medicamentos => {
      this.medicamentosSubject.next(medicamentos);
    });
  }

  private processMedicamentos(medicamentos: Medicamento[]): Medicamento[] {
    const today = new Date();
    return medicamentos.map(med => {
      const fechaCaducidad = new Date(med.fechaCaducidad);
      const diffTime = fechaCaducidad.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        ...med,
        fechaCaducidad: fechaCaducidad,
        diasParaCaducar: diffDays,
        alertaCaducidad: diffDays <= 30 && diffDays >= 0
      };
    });
  }

  getMedicamentos(): Observable<Medicamento[]> {
    return this.medicamentos$;
  }

  getMedicamentosProximosACaducar(dias: number = 30): Observable<Medicamento[]> {
    return this.medicamentos$.pipe(
      map(medicamentos => medicamentos.filter(m =>
        m.diasParaCaducar !== undefined &&
        m.diasParaCaducar <= dias &&
        m.diasParaCaducar >= 0
      ).sort((a, b) => (a.diasParaCaducar || 0) - (b.diasParaCaducar || 0)))
    );
  }

  getMedicamentoById(id: number): Observable<Medicamento | undefined> {
    return this.medicamentos$.pipe(
      map(medicamentos => medicamentos.find(m => m.id === id))
    );
  }

  addMedicamento(medicamento: MedicamentoRequest): Observable<Medicamento> {
    const medicamentos = this.medicamentosSubject.value;
    const newId = Math.max(...medicamentos.map(m => m.id), 0) + 1;
    const newMedicamento: Medicamento = {
      id: newId,
      ...medicamento
    };

    const updated = this.processMedicamentos([...medicamentos, newMedicamento]);
    this.medicamentosSubject.next(updated);

    return new Observable(observer => {
      observer.next(newMedicamento);
      observer.complete();
    });
  }

  updateMedicamento(id: number, medicamento: Partial<MedicamentoRequest>): Observable<Medicamento> {
    const medicamentos = this.medicamentosSubject.value;
    const index = medicamentos.findIndex(m => m.id === id);

    if (index !== -1) {
      const updated = [...medicamentos];
      updated[index] = { ...updated[index], ...medicamento };
      this.medicamentosSubject.next(this.processMedicamentos(updated));

      return new Observable(observer => {
        observer.next(updated[index]);
        observer.complete();
      });
    }

    throw new Error('Medicamento no encontrado');
  }

  deleteMedicamento(id: number): Observable<boolean> {
    const medicamentos = this.medicamentosSubject.value;
    const updated = medicamentos.filter(m => m.id !== id);
    this.medicamentosSubject.next(updated);

    return new Observable(observer => {
      observer.next(true);
      observer.complete();
    });
  }

  searchMedicamentos(term: string): Observable<Medicamento[]> {
    return this.medicamentos$.pipe(
      map(medicamentos => medicamentos.filter(m =>
        m.nombre.toLowerCase().includes(term.toLowerCase()) ||
        m.lote.toLowerCase().includes(term.toLowerCase()) ||
        m.proveedor.toLowerCase().includes(term.toLowerCase())
      ))
    );
  }
}
