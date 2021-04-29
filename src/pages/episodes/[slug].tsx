import { format, parseISO } from 'date-fns';
import Head from 'next/head'
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { usePlayer } from '../../contexts/PlayerContext';

import api from '../../services/api';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss'

interface Episode {
    id: string,
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    durationAsString: string,
    url: string,
    publishedAt: string,
    description: string
}

interface EpisodeProps {
    episode: Episode
}

export default function Episode({episode}: EpisodeProps) {

    const { play } = usePlayer()

    return (
        <div className={styles.episode}>
            <Head>

                <title>{episode.title} | Podcastr</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar"/>
                    </button>
                </Link>
                

                <Image 

                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                />

                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio"/>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}} />
                
            
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {

    return {
        paths: [],
        fallback: "blocking" // false = retorna um erro 404 se a página estática não tiver carregada no path 
                             // true = Espera toda a página carregar antes de pegar os dados, ai tem como usar o useRouter pra verificar esse com o isFallBack e retornar algo enquanto n carrega
                             
    }
}

export const getStaticProps: GetStaticProps = async(context) => {

    const {slug} = context.params

    const {data} = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        description: data.description,
  
        publishedAt: format(parseISO(data.published_at),"EEEE, d MMMM", {locale: ptBR}),
  
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
  
        url: data.file.url,
    }

    return {
        props: {
            episode: episode
        },
        revalidate: 60 * 60 * 24 // 24 horas
    }
}