import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const AboutGucciClubPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          GUCCI Clubについて
        </Typography>
      </Box>

      <Paper elevation={1} sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          GUCCI Clubとは
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mb: 3 }}>
          GUCCI Clubは、エンデューロ、モトクロスを愛する仲間たちが集まったコミュニティです。
          レース情報の共有や参加者同士の交流を通じて、エンデューロレースの魅力を広めることを目的としています。
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          活動内容
        </Typography>
        
        <Box component="ul" sx={{ pl: 2, mb: 3 }}>
          <Typography component="li" variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
            <strong>レース情報の収集・提供</strong><br />
            全国各地のエンデューロレース情報を収集し、このポータルサイトを通じて提供しています。
          </Typography>
          
          <Typography component="li" variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
            <strong>参加者サポート</strong><br />
            レース参加に関する情報提供や、初心者向けのサポートを行っています。
          </Typography>
          
          <Typography component="li" variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
            <strong>コミュニティ運営</strong><br />
            エンデューロレース愛好者同士の交流の場を提供し、コミュニティの発展に貢献しています。
          </Typography>
        </Box>

        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mb: 3 }}>
          GUCCI Clubは
          <a 
            href="http://www.kodomo-nirinjuku.net/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#1976d2', textDecoration: 'none' }}
          >
            NPO法人こども二輪塾
          </a>
          の活動を応援しメンバー共同で正会員に参加しています。
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          エンデューロ ポータルについて
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mb: 3 }}>
          このポータルサイトは、GUCCI Clubが運営するエンデューロレース情報の総合サイトです。
          全国各地のレース情報を一元化し、参加者の皆様により便利にレース情報をご利用いただけるよう努めています。
        </Typography>

        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          レース情報の追加や修正のご依頼は、GitHubのIssueからお気軽にお知らせください。
          皆様のご協力により、より充実したレース情報サイトを目指しています。
        </Typography>
      </Paper>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          onClick={() => navigate('/')}
          variant="outlined"
          color="primary"
          size="large"
        >
          ホームに戻る
        </Button>
      </Box>
    </Container>
  );
};

export default AboutGucciClubPage;