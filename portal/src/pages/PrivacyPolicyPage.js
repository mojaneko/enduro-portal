import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
} from '@mui/material';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          プライバシーポリシー
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            1. 個人情報の取り扱いについて
          </Typography>
          <Typography variant="body1" paragraph>
            当ポータルサイトでは、レース情報の表示のみを行っており、個人情報の収集は行っておりません。
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            2. Cookie等の使用について
          </Typography>
          <Typography variant="body1" paragraph>
            当サイトでは、サイトの利便性向上のためCookieを使用する場合があります。
            Cookieの使用を望まない場合は、ブラウザの設定で無効にすることができます。
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            3. 外部サイトへのリンクについて
          </Typography>
          <Typography variant="body1" paragraph>
            当サイトから外部サイト（エントリーサイト等）へのリンクがありますが、
            リンク先サイトでの個人情報の取り扱いについては、各サイトのプライバシーポリシーをご確認ください。
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            4. お問い合わせ
          </Typography>
          <Typography variant="body1" paragraph>
            本プライバシーポリシーに関するお問い合わせは、サイト内の連絡先までお願いいたします。
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            制定日：2026年1月26日
          </Typography>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBack}
            size="large"
            sx={{ minWidth: 200 }}
          >
            ホームに戻る
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicyPage;