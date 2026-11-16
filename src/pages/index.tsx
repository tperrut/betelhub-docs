import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function Card({
  title,
  description,
  to,
  cta,
}: {
  title: string;
  description: string;
  to: string;
  cta: string;
}) {
  return (
    <Link className={styles.card} to={to}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <p className={styles.cardText}>{description}</p>
      <span className={styles.cta}>{cta} →</span>
    </Link>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Documentação"
      description="Documentação do Betelhub, sistema de gestão de igrejas">
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Betelhub</h1>
          <p className={styles.subtitle}>
            Documentação do sistema de gestão de igrejas. Escolha por onde começar.
          </p>
        </section>

        <section className={styles.grid}>
          <Card
            title="Documentação de Negócio"
            description="Entenda o que cada módulo faz, as regras do dia a dia e veja as telas do sistema."
            to="/negocio"
            cta="Explorar negócio"
          />
          <Card
            title="Documentação Técnica"
            description="Arquitetura, modelo de dados, DDD, API, frontend e operação."
            to="/tecnico"
            cta="Explorar técnico"
          />
        </section>

        <p className={styles.note}>
          Piloto com os módulos Membros e Escola Dominical.
        </p>
      </main>
    </Layout>
  );
}
