import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const BlockedUserMessage = () => {
    const navigate = useNavigate();
    const { signOut } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <CardTitle className="text-xl text-gray-800">
                        Acesso Limitado
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Sua conta tem acesso limitado a algumas funcionalidades
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800">
                            Para acessar todas as funcionalidades do sistema, incluindo projetos, dispositivos, sensores e relatórios,
                            você precisa criar uma nova conta em nosso site.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700">Funcionalidades disponíveis:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li className="flex items-center">
                                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Visualização de dados dos sensores
                            </li>
                            <li className="flex items-center">
                                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Gráficos e análises básicas
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700">Funcionalidades bloqueadas:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li className="flex items-center">
                                <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Gerenciamento de projetos
                            </li>
                            <li className="flex items-center">
                                <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Configuração de dispositivos
                            </li>
                            <li className="flex items-center">
                                <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Relatórios avançados
                            </li>
                        </ul>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <Button
                            onClick={() => navigate('/')}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            Voltar para a Página Inicial
                        </Button>
                        <Button
                        variant={"secondary"}
                            onClick={
                                () => {
                                    signOut();
                                    window.location.href = '/auth/signup'
                                }
                            }
                            className="w-full mt-2"
                        >
                            Realizar cadastro
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 