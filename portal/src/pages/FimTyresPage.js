import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import TireRepairIcon from '@mui/icons-material/TireRepair';
import InfoIcon from '@mui/icons-material/Info';

const FimTyresPage = () => {
  const navigate = useNavigate();
  const [tyresData, setTyresData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedManufacturer, setSelectedManufacturer] = useState('all');

  useEffect(() => {
    const loadTyresData = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/data/tyres.json`);
        const data = await response.json();
        setTyresData(data);
      } catch (error) {
        console.error('タイヤデータの読み込みに失敗しました:', error);
        setTyresData({});
      } finally {
        setLoading(false);
      }
    };

    loadTyresData();
  }, []);

  const manufacturers = useMemo(() => {
    if (!tyresData) return [];
    return Object.keys(tyresData).sort();
  }, [tyresData]);

  const filteredTyres = useMemo(() => {
    if (!tyresData) return [];
    
    if (selectedManufacturer === 'all') {
      return Object.entries(tyresData).flatMap(([manufacturer, tyres]) =>
        tyres.map(tyre => ({ ...tyre, manufacturer }))
      );
    }
    
    return tyresData[selectedManufacturer]?.map(tyre => ({ 
      ...tyre, 
      manufacturer: selectedManufacturer 
    })) || [];
  }, [tyresData, selectedManufacturer]);

  const getCertificationColor = (certification) => {
    if (!certification) return 'default';
    if (certification.includes('E・DOT') || certification.includes('EマークorDOT')) return 'success';
    if (certification.includes('DOT')) return 'info';
    if (certification.includes('E刻印') || certification.includes('ECE75')) return 'warning';
    if (certification.includes('不明')) return 'error';
    return 'default';
  };

  const isRoadLegal = (tyre) => {
    const hasRoadCertification = tyre.certification && 
      (tyre.certification.includes('E・DOT') || 
       tyre.certification.includes('EマークorDOT') || 
       tyre.certification.includes('DOT'));
    
    const hasNHSRestriction = tyre.sizes?.some(size => size.includes('NHS')) ||
      tyre.notes?.includes('公道走行不可');
    
    return hasRoadCertification && !hasNHSRestriction;
  };

  if (loading) {
    return (
      <Box sx={{ backgroundColor: 'white', minHeight: 'calc(100vh - 200px)' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: 'calc(100vh - 200px)' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* ヘッダー */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <TireRepairIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
              FIMタイヤ確認
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            全日本エンデューロシリーズで使用可能なリヤタイヤの一覧です
          </Typography>
          <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InfoIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                データソース
              </Typography>
            </Box>
            <Typography variant="body2">
              このページの情報は{' '}
              <Link 
                href="https://jecpromotion.com/jec_fimtirelist/" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ fontWeight: 600 }}
              >
                JECプロモーション公式サイト
              </Link>
              {' '}の情報を元に作成しています。最新の情報は公式サイトでご確認ください。
            </Typography>
          </Alert>
        </Box>

        {/* フィルター */}
        <Box sx={{ mb: 4 }}>
          <FormControl fullWidth sx={{ maxWidth: 300 }}>
            <InputLabel>メーカー</InputLabel>
            <Select
              value={selectedManufacturer}
              label="メーカー"
              onChange={(e) => setSelectedManufacturer(e.target.value)}
            >
              <MenuItem value="all">すべてのメーカー</MenuItem>
              {manufacturers.map((manufacturer) => (
                <MenuItem key={manufacturer} value={manufacturer}>
                  {manufacturer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* タイヤリスト */}
        <Grid container spacing={3}>
          {filteredTyres.map((tyre, index) => (
            <Grid item xs={12} md={6} lg={4} key={`${tyre.manufacturer}-${tyre.model}-${index}`}>
              <Card 
                sx={{ 
                  height: '100%',
                  border: isRoadLegal(tyre) ? '2px solid #4caf50' : '1px solid #e0e0e0',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <CardContent>
                  {/* メーカー名 */}
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                    {tyre.manufacturer}
                  </Typography>
                  
                  {/* モデル名 */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
                    {tyre.model}
                  </Typography>

                  {/* 認証情報 */}
                  {tyre.certification && (
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={tyre.certification}
                        color={getCertificationColor(tyre.certification)}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      {isRoadLegal(tyre) && (
                        <Chip
                          label="公道走行可"
                          color="success"
                          size="small"
                          sx={{ ml: 1, mb: 1 }}
                        />
                      )}
                    </Box>
                  )}

                  {/* コンパウンド情報 */}
                  {tyre.compound && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>コンパウンド:</strong> {tyre.compound}
                    </Typography>
                  )}

                  {/* サイズ */}
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>サイズ:</strong>
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {tyre.sizes?.map((size, sizeIndex) => (
                      <Chip
                        key={sizeIndex}
                        label={size}
                        variant="outlined"
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>

                  {/* バリエーション（METZELER用） */}
                  {tyre.variants && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        バリエーション:
                      </Typography>
                      {Object.entries(tyre.variants).map(([variant, details]) => (
                        <Box key={variant} sx={{ ml: 1, mb: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            {variant}
                          </Typography>
                          <Box sx={{ ml: 1 }}>
                            {details.sizes?.map((size, sizeIndex) => (
                              <Chip
                                key={sizeIndex}
                                label={size}
                                variant="outlined"
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
                              />
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* 備考 */}
                  {tyre.notes && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      <Typography variant="caption">
                        {tyre.notes}
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredTyres.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              選択されたメーカーのタイヤが見つかりません
            </Typography>
          </Box>
        )}

        {/* ホームボタン */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
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
    </Box>
  );
};

export default FimTyresPage;